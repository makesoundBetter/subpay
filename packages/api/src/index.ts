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

  // Найти или создать пользователя
  const user = await prisma.user.upsert({
    where: { telegramId: String(telegramId) },
    update: { username, firstName },
    create: { telegramId: String(telegramId), firstName, username },
  })

  // Создать заявку
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      serviceId,
      duration,
      totalPrice,
      status: 'NEW',
    },
  })

  // Уведомить админа через бота
  const adminId = process.env.ADMIN_TELEGRAM_ID
  if (adminId) {
    await bot.api.sendMessage(
      adminId,
      `📦 *Новая заявка #${order.id}*\n\n` +
      `👤 Тип: ${firstName}${username ? ` (@${username})` : ''}\n` +
      `📱 Сервис: ${serviceName}\n` +
      `⏱ Период: ${duration}\n` +
      `💰 Сумма: $${totalPrice}`,
      { parse_mode: 'Markdown' }
    )
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
      },
    },
  })

  return user?.orders ?? []
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
