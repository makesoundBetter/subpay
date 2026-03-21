import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'
import { Bot } from 'grammy'

const app = Fastify({ logger: true })
const prisma = new PrismaClient()
const bot = new Bot(process.env.BOT_TOKEN!)

app.register(cors, { origin: true })

app.get('/health', async () => {
  return { status: 'ok' }
})

// Создать заявку
app.post('/orders', async (request, reply) => {
  const { telegramId, firstName, username, serviceId, serviceName, duration, totalPrice } = request.body as any

  const user = await prisma.user.upsert({
    where: { telegramId: String(telegramId) },
    update: { username, firstName },
    create: { telegramId: String(telegramId), firstName, username },
  })

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      serviceId,
      duration,
      totalPrice,
      status: 'NEW',
    },
  })

  const adminId = process.env.ADMIN_TELEGRAM_ID
  if (adminId) {
    try {
      await bot.api.sendMessage(
        adminId,
        `📦 *Новая заявка #${order.id}*\n\n` +
        `👤 ${firstName}${username ? ` (@${username})` : ''}\n` +
        `📱 Сервис: ${serviceName}\n` +
        `⏱ Период: ${duration}\n` +
        `💰 Сумма: $${totalPrice}`,
        {
          parse_mode: 'Markdown',
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

  return { success: true, orderId: order.id }
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
app.get('/admin/orders', async () => {
  const orders = await prisma.order.findMany({
    where: { status: { in: ['NEW', 'PROCESSING', 'AWAITING_PAYMENT'] } },
    include: { user: true, service: true },
    orderBy: { createdAt: 'desc' },
  })
  return orders
})

// Все заявки (для админ-панели)
app.get('/admin/orders/all', async () => {
  const orders = await prisma.order.findMany({
    include: { user: true, service: true },
    orderBy: { createdAt: 'desc' },
  })
  return orders
})

// Профиль пользователя со всеми заявками (для админ-панели)
app.get('/admin/users/:telegramId', async (request) => {
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
app.patch('/admin/orders/:id/status', async (request) => {
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
