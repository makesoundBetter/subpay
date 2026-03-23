import 'dotenv/config'
import { Bot } from 'grammy'

const token = process.env.BOT_TOKEN
if (!token) throw new Error('BOT_TOKEN is not set')

const adminTelegramId = process.env.ADMIN_TELEGRAM_ID
const apiUrl = process.env.API_URL || 'http://localhost:3000'
const adminApiKey = process.env.ADMIN_API_KEY || ''

const bot = new Bot(token)

const isAdmin = (ctx: any) => String(ctx.from?.id) === adminTelegramId

const statusLabel: Record<string, string> = {
  NEW: '🆕 Новая',
  PROCESSING: '⚙️ В работе',
  AWAITING_PAYMENT: '💳 Ожидает оплаты',
  PAID: '✅ Оплачена',
  COMPLETED: '🎉 Выполнена',
  CANCELLED: '❌ Отменена',
}

const userMessages: Record<string, string> = {
  PROCESSING: '⚙️ Ваша заявка взята в работу! Менеджер скоро свяжется с вами.',
  AWAITING_PAYMENT: '💳 Менеджер пришлёт реквизиты для оплаты.',
  COMPLETED: '🎉 Подписка активирована! Спасибо за использование Subpay Service.',
  CANCELLED: '❌ Ваша заявка отменена. Напишите менеджеру если есть вопросы.',
}

function getButtons(orderId: number, status: string) {
  if (status === 'NEW') {
    return [[
      { text: '⚙️ В работу', callback_data: `process_${orderId}` },
      { text: '❌ Отменить', callback_data: `cancel_${orderId}` },
    ]]
  }
  if (status === 'PROCESSING') {
    return [[
      { text: '💳 Запросить оплату', callback_data: `pay_${orderId}` },
      { text: '❌ Отменить', callback_data: `cancel_${orderId}` },
    ]]
  }
  if (status === 'AWAITING_PAYMENT') {
    return [[
      { text: '✅ Выполнено', callback_data: `done_${orderId}` },
      { text: '❌ Отменить', callback_data: `cancel_${orderId}` },
    ]]
  }
  return []
}

async function updateOrder(orderId: number, status: string) {
  const res = await fetch(`${apiUrl}/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminApiKey },
    body: JSON.stringify({ status }),
  })
  return res.json() as Promise<any>
}

async function notifyUser(order: any, status: string) {
  const msg = userMessages[status]
  if (!msg || !order.user?.telegramId) return
  try {
    await bot.api.sendMessage(
      order.user.telegramId,
      `${msg}\n\n📦 Заявка #${order.id} · ${order.duration} · $${order.totalPrice}`
    )
  } catch (e) {
    console.error('Failed to notify user:', e)
  }
}

// ── Help ─────────────────────────────────────────────────────
bot.command('help', (ctx) => ctx.reply(
  '📖 *Subpay Service — помощь*\n\n' +
  'Мы помогаем оплачивать зарубежные подписки для жителей СНГ.\n\n' +
  '*Как это работает:*\n' +
  '1️⃣ Открой каталог и выбери нужный сервис\n' +
  '2️⃣ Выбери период подписки и отправь заявку\n' +
  '3️⃣ Менеджер свяжется с тобой и пришлёт реквизиты\n' +
  '4️⃣ После оплаты — подписка активируется\n\n' +
  '*Команды:*\n' +
  '/start — главное меню\n' +
  '/help — эта справка\n\n' +
  '💬 Вопросы? Напиши нам — менеджер ответит в течение нескольких минут.',
  {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[
        { text: '🚀 Открыть каталог', web_app: { url: 'https://subpay-mini-app.vercel.app' } }
      ]]
    }
  }
))

// ── Приветствие ──────────────────────────────────────────────
bot.command('start', (ctx) => ctx.reply(
  'Добро пожаловать в Subpay Service! 🎉\n\nОплачивайте зарубежные подписки легко и быстро.',
  {
    reply_markup: {
      inline_keyboard: [[
        { text: '🚀 Открыть Subpay Service', web_app: { url: 'https://subpay-mini-app.vercel.app' } }
      ]]
    }
  }
))

// ── Список активных заявок ───────────────────────────────────
bot.command('orders', async (ctx) => {
  if (!isAdmin(ctx)) return

  const res = await fetch(`${apiUrl}/admin/orders`, { headers: { 'x-admin-key': adminApiKey } })
  const orders = await res.json() as any[]

  if (!orders.length) return ctx.reply('Нет активных заявок ✅')

  const lines = orders.map(o =>
    `*#${o.id}* ${statusLabel[o.status]}\n` +
    `👤 ${o.user.firstName}${o.user.username ? ` @${o.user.username}` : ''}\n` +
    `📱 ${o.service?.name ?? o.serviceId} · ${o.duration} · $${o.totalPrice}`
  )

  await ctx.reply(lines.join('\n\n'), { parse_mode: 'Markdown' })
})

// ── Команды изменения статуса ────────────────────────────────
bot.command('process', async (ctx) => {
  if (!isAdmin(ctx)) return
  const id = parseInt(ctx.match?.trim() ?? '')
  if (!id) return ctx.reply('Укажи ID: /process 5')
  const order = await updateOrder(id, 'PROCESSING')
  await notifyUser(order, 'PROCESSING')
  await ctx.reply(`✅ Заявка #${id} → ⚙️ В работе`)
})

bot.command('pay', async (ctx) => {
  if (!isAdmin(ctx)) return
  const id = parseInt(ctx.match?.trim() ?? '')
  if (!id) return ctx.reply('Укажи ID: /pay 5')
  const order = await updateOrder(id, 'AWAITING_PAYMENT')
  await notifyUser(order, 'AWAITING_PAYMENT')
  await ctx.reply(`✅ Заявка #${id} → 💳 Ожидает оплаты`)
})

bot.command('done', async (ctx) => {
  if (!isAdmin(ctx)) return
  const id = parseInt(ctx.match?.trim() ?? '')
  if (!id) return ctx.reply('Укажи ID: /done 5')
  const order = await updateOrder(id, 'COMPLETED')
  await notifyUser(order, 'COMPLETED')
  await ctx.reply(`✅ Заявка #${id} → 🎉 Выполнена`)
})

bot.command('cancel', async (ctx) => {
  if (!isAdmin(ctx)) return
  const id = parseInt(ctx.match?.trim() ?? '')
  if (!id) return ctx.reply('Укажи ID: /cancel 5')
  const order = await updateOrder(id, 'CANCELLED')
  await notifyUser(order, 'CANCELLED')
  await ctx.reply(`✅ Заявка #${id} → ❌ Отменена`)
})

// ── Инлайн-кнопки ───────────────────────────────────────────
bot.callbackQuery(/^process_(\d+)$/, async (ctx) => {
  if (!isAdmin(ctx)) return ctx.answerCallbackQuery()
  const id = parseInt(ctx.match[1])
  const order = await updateOrder(id, 'PROCESSING')
  await notifyUser(order, 'PROCESSING')
  await ctx.editMessageReplyMarkup({ reply_markup: { inline_keyboard: getButtons(id, 'PROCESSING') } })
  await ctx.answerCallbackQuery('⚙️ В работу')
})

bot.callbackQuery(/^pay_(\d+)$/, async (ctx) => {
  if (!isAdmin(ctx)) return ctx.answerCallbackQuery()
  const id = parseInt(ctx.match[1])
  const order = await updateOrder(id, 'AWAITING_PAYMENT')
  await notifyUser(order, 'AWAITING_PAYMENT')
  await ctx.editMessageReplyMarkup({ reply_markup: { inline_keyboard: getButtons(id, 'AWAITING_PAYMENT') } })
  await ctx.answerCallbackQuery('💳 Запрошена оплата')
})

bot.callbackQuery(/^done_(\d+)$/, async (ctx) => {
  if (!isAdmin(ctx)) return ctx.answerCallbackQuery()
  const id = parseInt(ctx.match[1])
  const order = await updateOrder(id, 'COMPLETED')
  await notifyUser(order, 'COMPLETED')
  await ctx.editMessageReplyMarkup({ reply_markup: { inline_keyboard: [] } })
  await ctx.answerCallbackQuery('🎉 Выполнено!')
})

bot.callbackQuery(/^cancel_(\d+)$/, async (ctx) => {
  if (!isAdmin(ctx)) return ctx.answerCallbackQuery()
  const id = parseInt(ctx.match[1])
  const order = await updateOrder(id, 'CANCELLED')
  await notifyUser(order, 'CANCELLED')
  await ctx.editMessageReplyMarkup({ reply_markup: { inline_keyboard: [] } })
  await ctx.answerCallbackQuery('❌ Отменена')
})

bot.api.setMyCommands([
  { command: 'start', description: '🚀 Открыть Subpay Service' },
  { command: 'help', description: '📖 Помощь и как это работает' },
])

bot.start()
console.log('Bot started')
