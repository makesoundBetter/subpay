import 'dotenv/config'
import { Bot } from 'grammy'

const token = process.env.BOT_TOKEN
if (!token) throw new Error('BOT_TOKEN is not set')

const bot = new Bot(token)

bot.command('start', (ctx) => ctx.reply('Добро пожаловать в Subpay! 🎉\n\nОплачивайте зарубежные подписки легко и быстро.', {
  reply_markup: {
    inline_keyboard: [[
      { text: '🚀 Открыть Subpay', web_app: { url: 'https://subpay-mini-app.vercel.app' } }
    ]]
  }
}))

bot.start()
console.log('Bot started')
