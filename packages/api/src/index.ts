import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import { PrismaClient, OrderStatus } from '@prisma/client'
import { Bot } from 'grammy'
import { createInvoice, verifyWebhook, setWebhook } from './cryptobot.js'

// Типы для тел запросов
interface CreateOrderBody {
  telegramId: string | number
  firstName: string
  username?: string
  serviceId: number
  serviceName: string
  duration: string
  totalPrice: number
  comment?: string
  paymentMethod: string
}

interface UpdateStatusBody {
  status: string
}

// Проверка обязательных env-переменных при старте
const REQUIRED_ENV = ['BOT_TOKEN', 'ADMIN_TELEGRAM_ID', 'ADMIN_API_KEY', 'DATABASE_URL', 'CRYPTOBOT_API_TOKEN']
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`Missing required env variable: ${key}`)
    process.exit(1)
  }
}

const app = Fastify({ logger: true, bodyLimit: 1048576 }) // 1MB max body
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

// Каталог сервисов
app.get('/services', async () => {
  const categories = await prisma.category.findMany({
    include: {
      services: {
        where: { isActive: true },
        include: { prices: true },
        orderBy: { id: 'asc' },
      },
    },
    orderBy: { id: 'asc' },
  })
  return categories.filter(c => c.services.length > 0)
})

// Проверка Content-Type для POST/PATCH запросов (защита от form-based CSRF)
app.addHook('preHandler', async (request: any, reply: any) => {
  if (['POST', 'PATCH'].includes(request.method) && !request.url.includes('/webhooks/')) {
    const ct = request.headers['content-type'] || ''
    if (!ct.includes('application/json')) {
      return reply.code(415).send({ error: 'Content-Type must be application/json' })
    }
  }
})

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
  const { telegramId, firstName, username, serviceId, serviceName, duration, totalPrice, comment, paymentMethod } = request.body as CreateOrderBody

  // Валидация обязательных полей
  if (!telegramId || !firstName || !serviceId || !duration || totalPrice === undefined || totalPrice === null) {
    return reply.code(400).send({ error: 'Missing required fields' })
  }

  // Валидация цены
  if (typeof totalPrice !== 'number' || totalPrice <= 0) {
    return reply.code(400).send({ error: 'Invalid totalPrice' })
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
      status: isCrypto ? OrderStatus.AWAITING_PAYMENT : OrderStatus.NEW,
      notes: comment || null,
      paymentMethod: paymentMethod || 'TRANSFER',
    },
  })

  let paymentData = null

  if (isCrypto) {
    try {
      const invoice = await createInvoice({
        orderId: order.id,
        amountUsd: totalPrice,
        description: `${serviceName} - ${duration}`,
      })

      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentId: String(invoice.invoiceId),
          paymentAddress: invoice.payUrl,
        },
      })

      paymentData = invoice
    } catch (e) {
      app.log.error('Failed to create CryptoBot invoice: ' + e)
    }
  }

  const adminId = process.env.ADMIN_TELEGRAM_ID
  if (adminId) {
    try {
      const paymentLine = isCrypto
        ? `\n💳 Оплата: CryptoBot`
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
  const { orderId } = request.params as Record<string, string>
  const order = await prisma.order.findUnique({
    where: { id: parseInt(orderId, 10) },
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

// Webhook от CryptoBot
app.post('/webhooks/cryptobot', { config: { rawBody: true } }, async (request, reply) => {
  const signature = (request.headers['crypto-pay-api-signature'] as string) || ''
  const rawBody = (request as any).rawBody as string

  if (!verifyWebhook(rawBody, signature)) {
    app.log.warn(`CryptoBot webhook signature mismatch from IP ${request.ip}`)
    return reply.code(401).send({ error: 'Invalid signature' })
  }

  const body = request.body as any

  if (body.update_type !== 'invoice_paid') return { ok: true }

  const invoice = body.payload
  const orderId = parseInt(invoice.payload, 10)

  if (!orderId || isNaN(orderId)) {
    return reply.code(400).send({ error: 'Invalid order payload' })
  }

  // updateMany с условием на статус — идемпотентность + защита от race condition
  const { count } = await prisma.order.updateMany({
    where: { id: orderId, status: { in: [OrderStatus.AWAITING_PAYMENT] } },
    data: { status: OrderStatus.PAID },
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
          `✅ <b>Оплачено! Заявка #${order.id}</b>\n\n` +
          `👤 ${escapeHtml(order.user.firstName)}\n` +
          `📱 ${escapeHtml(order.service?.name ?? '—')}\n` +
          `💰 $${order.totalPrice} (CryptoBot)`,
          { parse_mode: 'HTML' }
        )
      } catch (e) {
        app.log.error('Failed to notify admin about payment: ' + e)
      }
    }

    if (order) {
      try {
        await bot.api.sendMessage(
          order.user.telegramId,
          `✅ <b>Оплата подтверждена!</b>\n\nВаша заявка #${order.id} оплачена. Менеджер приступит к выполнению.`,
          { parse_mode: 'HTML' }
        )
      } catch (e) {
        app.log.error('Failed to notify user about payment: ' + e)
      }
    }
  }

  return { ok: true }
})

// Получить заявки пользователя
app.get('/orders/:telegramId', async (request) => {
  const { telegramId } = request.params as Record<string, string>

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
  // Возвращаем пустой массив если пользователь не найден — это нормально для новых юзеров
})

// Получить активные заявки (для бота)
app.get('/admin/orders', { preHandler: adminAuth }, async () => {
  const orders = await prisma.order.findMany({
    where: { status: { in: [OrderStatus.NEW, OrderStatus.PROCESSING, OrderStatus.AWAITING_PAYMENT] } },
    include: { user: true, service: true },
    orderBy: { createdAt: 'desc' },
  })
  return orders
})

// Все заявки (для админ-панели) с пагинацией
app.get('/admin/orders/all', { preHandler: adminAuth }, async (request) => {
  const { page = '1', limit = '50' } = request.query as Record<string, string>
  const pageNum = Math.max(1, parseInt(page, 10))
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)))
  const skip = (pageNum - 1) * limitNum

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      include: { user: true, service: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    }),
    prisma.order.count(),
  ])

  return { orders, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) }
})

// Профиль пользователя со всеми заявками (для админ-панели)
app.get('/admin/users/:telegramId', { preHandler: adminAuth }, async (request, reply) => {
  const { telegramId } = request.params as Record<string, string>
  const user = await prisma.user.findUnique({
    where: { telegramId: String(telegramId) },
    include: {
      orders: {
        include: { service: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
  if (!user) return reply.code(404).send({ error: 'User not found' })
  return user
})

// Обновить статус заявки (для бота)
app.patch('/admin/orders/:id/status', { preHandler: adminAuth }, async (request) => {
  const { id } = request.params as Record<string, string>
  const { status } = request.body as UpdateStatusBody

  const order = await prisma.order.update({
    where: { id: parseInt(id, 10) },
    data: { status: status as OrderStatus },
    include: { user: true, service: true },
  })

  return order
})

const start = async () => {
  try {
    await prisma.$connect()
    app.log.info('Database connection established')
  } catch (err) {
    app.log.error('Failed to connect to database: ' + err)
    process.exit(1)
  }

  if (process.env.API_URL) {
    try {
      await setWebhook(`${process.env.API_URL}/webhooks/cryptobot`)
      app.log.info('CryptoBot webhook registered')
    } catch (e) {
      app.log.error('Failed to set CryptoBot webhook: ' + e)
    }
  }

  try {
    await app.listen({ port: 3000, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
