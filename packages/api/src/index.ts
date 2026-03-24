import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import { PrismaClient } from '@prisma/client'
import { Bot } from 'grammy'
import { createPayment, verifyWebhook, CRYPTO_CURRENCIES } from './cryptomus.js'

const app = Fastify({ logger: true })
const prisma = new PrismaClient()
const bot = new Bot(process.env.BOT_TOKEN!)

app.register(cors, {
  origin: ['https://admin-indol-sigma-13.vercel.app', 'https://subpay-mini-app.vercel.app'],
})

// Rate limiting: глобально 60 запросов в минуту с одного IP
app.register(rateLimit, {
  global: true,
  max: 60,
  timeWindow: '1 minute',
  errorResponseBuilder: () => ({ error: 'Too many requests, please try again later' }),
})

// Экранирование HTML для Telegram-сообщений
const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Admin API key middleware
const adminAuth = async (request: any, reply: any) => {
  const key = request.headers['x-admin-key']
  if (!key || key !== process.env.ADMIN_API_KEY) {
    return reply.code(401).send({ error: 'Unauthorized' })
  }
}

app.get('/health', async () => {
  return { status: 'ok' }
})

// Создать заявку
app.post('/orders', { config: { rateLimit: { max: 5, timeWindow: '1 minute' } } }, async (request, reply) => {
  const { telegramId, firstName, username, serviceId, serviceName, duration, totalPrice, comment, paymentMethod, cryptoCurrency } = request.body as any

  // Валидация обязательных полей
  if (!telegramId || !firstName || !serviceId || !duration || totalPrice === undefined || totalPrice === null) {
    return reply.code(400).send({ error: 'Missing required fields' })
  }

  // Валидация цены
  if (typeof totalPrice !== 'number' || totalPrice <= 0) {
    return reply.code(400).send({ error: 'Invalid totalPrice' })
  }

  // Валидация cryptoCurrency
  if (paymentMethod === 'CRYPTO' && !CRYPTO_CURRENCIES[cryptoCurrency as string]) {
    return reply.code(400).send({ error: 'Invalid cryptoCurrency' })
  }

  // Проверяем что сервис существует и активен
  const service = await prisma.service.findUnique({
    where: { id: Number(serviceId) },
    include: { prices: true },
  })
  if (!service || !service.isActive) {
    return reply.code(400).send({ error: 'Service not found' })
  }

  // Проверяем что цена совпадает с реальной ценой в БД
  const price = service.prices.find(p => p.duration === duration)
  if (!price) {
    return reply.code(400).send({ error: 'Invalid duration' })
  }
  if (Math.abs(price.total - totalPrice) > 0.01) {
    return reply.code(400).send({ error: 'Invalid totalPrice' })
  }

  const user = await prisma.user.upsert({
    where: { telegramId: String(telegramId) },
    update: { username, firstName },
    create: { telegramId: String(telegramId), firstName, username },
  })

  const isCrypto = paymentMethod === 'CRYPTO'

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      serviceId: Number(serviceId),
      duration,
      totalPrice,
      status: isCrypto ? 'AWAITING_PAYMENT' : 'NEW',
      notes: comment || null,
      paymentMethod: paymentMethod || 'TRANSFER',
      cryptoCurrency: isCrypto ? cryptoCurrency : null,
    },
  })

  let paymentData = null

  if (isCrypto && cryptoCurrency) {
    try {
      const coin = CRYPTO_CURRENCIES[cryptoCurrency]
      const webhookUrl = `${process.env.API_URL}/webhooks/nowpayments`
      const payment = await createPayment({
        orderId: order.id,
        amountUsd: totalPrice,
        payCurrency: coin.code,
        webhookUrl,
        description: `${serviceName} - ${duration}`,
      })

      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentId: payment.paymentId,
          paymentAddress: payment.address,
          paymentAmount: payment.amount,
          cryptoCurrency: payment.currency,
        },
      })

      paymentData = payment
    } catch (e) {
      app.log.error('Failed to create NOWPayments payment: ' + e)
    }
  }

  const adminId = process.env.ADMIN_TELEGRAM_ID
  if (adminId) {
    try {
      const paymentLine = isCrypto
        ? `\n💳 Оплата: Крипта (${cryptoCurrency})`
        : `\n💳 Оплата: Перевод менеджеру`
      await bot.api.sendMessage(
        adminId,
        `📦 <b>Новая заявка #${order.id}</b>\n\n` +
        `👤 ${escapeHtml(firstName)}${username ? ` (@${escapeHtml(username)})` : ''}\n` +
        `📱 Сервис: ${escapeHtml(serviceName)}\n` +
        `⏱ Период: ${escapeHtml(duration)}\n` +
        `💰 Сумма: $${totalPrice}` +
        paymentLine +
        (comment ? `\n\n💬 Комментарий: ${escapeHtml(comment)}` : ''),
        {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [[
              { text: '⚙️ В работу', callback_data: `process_${order.id}` },
              { text: '❌ Отменить', callback_data: `cancel_${order.id}` },
            ]]
          }
        }
      )
    } catch (e) {
      app.log.error('Failed to send Telegram notification: ' + e)
    }
  }

  return { success: true, orderId: order.id, paymentData }
})

// Статус платежа по заявке
app.get('/orders/:orderId/payment', async (request) => {
  const { orderId } = request.params as any
  const order = await prisma.order.findUnique({
    where: { id: parseInt(orderId) },
    select: {
      id: true,
      status: true,
      paymentMethod: true,
      cryptoCurrency: true,
      paymentId: true,
      paymentAddress: true,
      paymentAmount: true,
      totalPrice: true,
    },
  })
  return order
})

// Webhook от NOWPayments
app.post('/webhooks/nowpayments', { config: { rawBody: true } }, async (request, reply) => {
  const signature = (request.headers['x-nowpayments-sig'] as string) || ''
  const rawBody = (request as any).rawBody as string

  if (!verifyWebhook(rawBody, signature)) {
    return reply.code(401).send({ error: 'Invalid signature' })
  }

  const body = request.body as any
  const orderId = parseInt(body.order_id, 10)
  const paymentStatus = body.payment_status

  if (!orderId || isNaN(orderId)) {
    return reply.code(400).send({ error: 'Invalid order_id' })
  }

  // NOWPayments statuses: waiting → confirming → confirmed → sending → partially_paid → finished → failed → refunded → expired
  if (['finished', 'confirmed'].includes(paymentStatus)) {
    // updateMany с условием на статус — идемпотентность + защита от race condition:
    // если заказ уже PAID/COMPLETED/CANCELLED — обновление не произойдёт (count = 0)
    const { count } = await prisma.order.updateMany({
      where: { id: orderId, status: { in: ['AWAITING_PAYMENT'] } },
      data: { status: 'PAID' },
    })

    // Уведомления отправляем только если статус реально изменился
    if (count > 0) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { user: true, service: true },
      })

      const adminId = process.env.ADMIN_TELEGRAM_ID
      if (adminId && order) {
        try {
          await bot.api.sendMessage(
            adminId,
            `✅ *Оплачено! Заявка #${order.id}*\n\n` +
            `👤 ${order.user.firstName}\n` +
            `📱 ${order.service?.name ?? '—'}\n` +
            `💰 $${order.totalPrice} (${order.cryptoCurrency})`,
            { parse_mode: 'Markdown' }
          )
        } catch (e) {
          app.log.error('Failed to notify admin about payment: ' + e)
        }
      }

      if (order) {
        try {
          await bot.api.sendMessage(
            order.user.telegramId,
            `✅ *Оплата подтверждена!*\n\nВаша заявка #${order.id} оплачена. Менеджер приступит к выполнению.`,
            { parse_mode: 'Markdown' }
          )
        } catch (e) {
          app.log.error('Failed to notify user about payment: ' + e)
        }
      }
    }
  } else if (['failed', 'expired'].includes(paymentStatus)) {
    // Только если заказ ещё не финализирован
    await prisma.order.updateMany({
      where: { id: orderId, status: { in: ['AWAITING_PAYMENT'] } },
      data: { status: 'CANCELLED' },
    })
  }

  return { ok: true }
})

// Получить заявки пользователя
app.get('/orders/:telegramId', async (request) => {
  const { telegramId } = request.params as any

  const user = await prisma.user.findUnique({
    where: { telegramId: String(telegramId) },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { service: true },
      },
    },
  })

  return user?.orders ?? []
})

// Получить активные заявки (для бота)
app.get('/admin/orders', { preHandler: adminAuth }, async () => {
  const orders = await prisma.order.findMany({
    where: { status: { in: ['NEW', 'PROCESSING', 'AWAITING_PAYMENT'] } },
    include: { user: true, service: true },
    orderBy: { createdAt: 'desc' },
  })
  return orders
})

// Все заявки (для админ-панели)
app.get('/admin/orders/all', { preHandler: adminAuth }, async () => {
  const orders = await prisma.order.findMany({
    include: { user: true, service: true },
    orderBy: { createdAt: 'desc' },
  })
  return orders
})

// Профиль пользователя со всеми заявками (для админ-панели)
app.get('/admin/users/:telegramId', { preHandler: adminAuth }, async (request) => {
  const { telegramId } = request.params as any
  const user = await prisma.user.findUnique({
    where: { telegramId: String(telegramId) },
    include: {
      orders: {
        include: { service: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
  return user
})

// Обновить статус заявки (для бота)
app.patch('/admin/orders/:id/status', { preHandler: adminAuth }, async (request) => {
  const { id } = request.params as any
  const { status } = request.body as any

  const order = await prisma.order.update({
    where: { id: parseInt(id) },
    data: { status },
    include: { user: true, service: true },
  })

  return order
})

const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
