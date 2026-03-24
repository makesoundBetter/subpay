import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const ai = await prisma.category.upsert({
    where: { slug: 'ai' },
    update: {},
    create: { name: 'AI', slug: 'ai', emoji: '🤖' },
  })

  const education = await prisma.category.upsert({
    where: { slug: 'education' },
    update: {},
    create: { name: 'Образование', slug: 'education', emoji: '📚' },
  })

  const games = await prisma.category.upsert({
    where: { slug: 'games' },
    update: {},
    create: { name: 'Игры', slug: 'games', emoji: '🎮' },
  })

  const design = await prisma.category.upsert({
    where: { slug: 'design' },
    update: {},
    create: { name: 'Дизайн', slug: 'design', emoji: '🎨' },
  })

  const other = await prisma.category.upsert({
    where: { slug: 'other' },
    update: {},
    create: { name: 'Другое', slug: 'other', emoji: '📦' },
  })

  const social = await prisma.category.upsert({
    where: { slug: 'social' },
    update: {},
    create: { name: 'Соц. сети', slug: 'social', emoji: '📱' },
  })

  const dev = await prisma.category.upsert({
    where: { slug: 'dev' },
    update: {},
    create: { name: 'Разработка', slug: 'dev', emoji: '💻' },
  })

  const cloud = await prisma.category.upsert({
    where: { slug: 'cloud' },
    update: {},
    create: { name: 'Облако', slug: 'cloud', emoji: '☁️' },
  })

  const travel = await prisma.category.upsert({
    where: { slug: 'travel' },
    update: {},
    create: { name: 'Путешествия', slug: 'travel', emoji: '✈️' },
  })

  const home = await prisma.category.upsert({
    where: { slug: 'home' },
    update: {},
    create: { name: 'Дом и VPN', slug: 'home', emoji: '🏠' },
  })

  const payment = await prisma.category.upsert({
    where: { slug: 'payment' },
    update: {},
    create: { name: 'Оплата', slug: 'payment', emoji: '💳' },
  })

  const chatgpt = await prisma.service.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      categoryId: ai.id,
      name: 'ChatGPT Plus',
      prices: {
        create: [
          { duration: '1 месяц', basePrice: 20, commission: 5, total: 25 },
          { duration: '3 месяца', basePrice: 60, commission: 10, total: 70 },
          { duration: '1 год', basePrice: 220, commission: 30, total: 250 },
        ],
      },
    },
  })

  await prisma.service.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      categoryId: ai.id,
      name: 'Claude Pro',
      prices: {
        create: [
          { duration: '1 месяц', basePrice: 20, commission: 5, total: 25 },
          { duration: '3 месяца', basePrice: 60, commission: 10, total: 70 },
        ],
      },
    },
  })

  await prisma.service.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      categoryId: ai.id,
      name: 'Midjourney',
      prices: {
        create: [
          { duration: '1 месяц', basePrice: 12, commission: 3, total: 15 },
          { duration: '3 месяца', basePrice: 34, commission: 6, total: 40 },
        ],
      },
    },
  })

  await prisma.service.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      categoryId: education.id,
      name: 'Duolingo Plus',
      prices: {
        create: [
          { duration: '1 месяц', basePrice: 8, commission: 2, total: 10 },
          { duration: '1 год', basePrice: 70, commission: 10, total: 80 },
        ],
      },
    },
  })

  await prisma.service.upsert({
    where: { id: 5 },
    update: {},
    create: {
      id: 5,
      categoryId: other.id,
      name: 'Spotify',
      prices: {
        create: [
          { duration: '1 месяц', basePrice: 6, commission: 2, total: 8 },
          { duration: '3 месяца', basePrice: 18, commission: 4, total: 22 },
          { duration: '1 год', basePrice: 70, commission: 10, total: 80 },
        ],
      },
    },
  })

  await prisma.service.upsert({
    where: { id: 6 },
    update: {},
    create: {
      id: 6,
      categoryId: education.id,
      name: 'Steam',
      prices: {
        create: [
          { duration: '$10 баланс', basePrice: 10, commission: 2, total: 12 },
          { duration: '$25 баланс', basePrice: 25, commission: 3, total: 28 },
        ],
      },
    },
  })

  // AI services (ids 7-23)
  await prisma.service.upsert({ where: { id: 7 }, update: {}, create: { id: 7, categoryId: ai.id, name: 'Suno AI', prices: { create: [{ duration: '1 месяц', basePrice: 10, commission: 2, total: 12 }, { duration: '3 месяца', basePrice: 27, commission: 5, total: 32 }] } } })
  await prisma.service.upsert({ where: { id: 8 }, update: {}, create: { id: 8, categoryId: ai.id, name: 'Gamma AI', prices: { create: [{ duration: '1 месяц', basePrice: 10, commission: 2, total: 12 }, { duration: '1 год', basePrice: 100, commission: 20, total: 120 }] } } })
  await prisma.service.upsert({ where: { id: 9 }, update: {}, create: { id: 9, categoryId: ai.id, name: 'DeepSeek', prices: { create: [{ duration: '1 месяц', basePrice: 7, commission: 1, total: 8 }] } } })
  await prisma.service.upsert({ where: { id: 10 }, update: {}, create: { id: 10, categoryId: ai.id, name: 'Cursor AI', prices: { create: [{ duration: '1 месяц', basePrice: 18, commission: 4, total: 22 }, { duration: '1 год', basePrice: 183, commission: 37, total: 220 }] } } })
  await prisma.service.upsert({ where: { id: 11 }, update: {}, create: { id: 11, categoryId: ai.id, name: 'Krea AI', prices: { create: [{ duration: '1 месяц', basePrice: 32, commission: 6, total: 38 }, { duration: '1 год', basePrice: 317, commission: 63, total: 380 }] } } })
  await prisma.service.upsert({ where: { id: 12 }, update: {}, create: { id: 12, categoryId: ai.id, name: 'OpenAI API', prices: { create: [{ duration: '$10 кредиты', basePrice: 10, commission: 2, total: 12 }, { duration: '$50 кредиты', basePrice: 50, commission: 8, total: 58 }] } } })
  await prisma.service.upsert({ where: { id: 13 }, update: {}, create: { id: 13, categoryId: ai.id, name: 'Kling AI', prices: { create: [{ duration: '1 месяц', basePrice: 15, commission: 3, total: 18 }, { duration: '3 месяца', basePrice: 40, commission: 8, total: 48 }] } } })
  await prisma.service.upsert({ where: { id: 14 }, update: {}, create: { id: 14, categoryId: ai.id, name: 'Freepik Premium', prices: { create: [{ duration: '1 месяц', basePrice: 13, commission: 2, total: 15 }, { duration: '1 год', basePrice: 125, commission: 25, total: 150 }] } } })
  await prisma.service.upsert({ where: { id: 15 }, update: {}, create: { id: 15, categoryId: ai.id, name: 'Runway AI', prices: { create: [{ duration: '1 месяц', basePrice: 15, commission: 3, total: 18 }, { duration: '3 месяца', basePrice: 42, commission: 8, total: 50 }] } } })
  await prisma.service.upsert({ where: { id: 16 }, update: {}, create: { id: 16, categoryId: ai.id, name: 'ElevenLabs', prices: { create: [{ duration: '1 месяц', basePrice: 6, commission: 1, total: 7 }, { duration: '3 месяца', basePrice: 15, commission: 3, total: 18 }] } } })
  await prisma.service.upsert({ where: { id: 17 }, update: {}, create: { id: 17, categoryId: ai.id, name: 'Candy AI', prices: { create: [{ duration: '1 месяц', basePrice: 15, commission: 3, total: 18 }] } } })
  await prisma.service.upsert({ where: { id: 18 }, update: {}, create: { id: 18, categoryId: ai.id, name: 'Lensa AI', prices: { create: [{ duration: '1 месяц', basePrice: 7, commission: 1, total: 8 }, { duration: '1 год', basePrice: 27, commission: 5, total: 32 }] } } })
  await prisma.service.upsert({ where: { id: 19 }, update: {}, create: { id: 19, categoryId: ai.id, name: 'Higgsfield AI', prices: { create: [{ duration: '1 месяц', basePrice: 18, commission: 4, total: 22 }] } } })
  await prisma.service.upsert({ where: { id: 20 }, update: {}, create: { id: 20, categoryId: ai.id, name: 'Google Gemini Adv.', prices: { create: [{ duration: '1 месяц', basePrice: 18, commission: 4, total: 22 }, { duration: '1 год', basePrice: 183, commission: 37, total: 220 }] } } })
  await prisma.service.upsert({ where: { id: 21 }, update: {}, create: { id: 21, categoryId: ai.id, name: 'Perplexity Pro', prices: { create: [{ duration: '1 месяц', basePrice: 18, commission: 4, total: 22 }, { duration: '1 год', basePrice: 183, commission: 37, total: 220 }] } } })
  await prisma.service.upsert({ where: { id: 22 }, update: {}, create: { id: 22, categoryId: ai.id, name: 'Grok Premium', prices: { create: [{ duration: '1 месяц', basePrice: 15, commission: 3, total: 18 }, { duration: '1 год', basePrice: 150, commission: 30, total: 180 }] } } })
  await prisma.service.upsert({ where: { id: 23 }, update: {}, create: { id: 23, categoryId: ai.id, name: 'NanoBanana', prices: { create: [{ duration: '1 месяц', basePrice: 10, commission: 2, total: 12 }] } } })

  // Social (ids 24-35)
  await prisma.service.upsert({ where: { id: 24 }, update: {}, create: { id: 24, categoryId: social.id, name: 'TikTok', prices: { create: [{ duration: '1 месяц', basePrice: 7, commission: 1, total: 8 }] } } })
  await prisma.service.upsert({ where: { id: 25 }, update: {}, create: { id: 25, categoryId: social.id, name: 'Patreon', prices: { create: [{ duration: '1 месяц', basePrice: 7, commission: 1, total: 8 }, { duration: '3 месяца', basePrice: 18, commission: 4, total: 22 }] } } })
  await prisma.service.upsert({ where: { id: 26 }, update: {}, create: { id: 26, categoryId: social.id, name: 'OnlyFans', prices: { create: [{ duration: '1 месяц', basePrice: 10, commission: 2, total: 12 }] } } })
  await prisma.service.upsert({ where: { id: 27 }, update: {}, create: { id: 27, categoryId: social.id, name: 'Faceit', prices: { create: [{ duration: '1 месяц', basePrice: 8, commission: 2, total: 10 }, { duration: '3 месяца', basePrice: 23, commission: 4, total: 27 }] } } })
  await prisma.service.upsert({ where: { id: 28 }, update: {}, create: { id: 28, categoryId: social.id, name: 'YouTube Premium', prices: { create: [{ duration: '1 месяц', basePrice: 7, commission: 1, total: 8 }, { duration: '1 год', basePrice: 67, commission: 13, total: 80 }] } } })
  await prisma.service.upsert({ where: { id: 29 }, update: {}, create: { id: 29, categoryId: social.id, name: 'Twitch', prices: { create: [{ duration: '1 месяц', basePrice: 7, commission: 1, total: 8 }] } } })
  await prisma.service.upsert({ where: { id: 30 }, update: {}, create: { id: 30, categoryId: social.id, name: 'Discord Nitro', prices: { create: [{ duration: '1 месяц', basePrice: 10, commission: 2, total: 12 }, { duration: '1 год', basePrice: 100, commission: 20, total: 120 }] } } })
  await prisma.service.upsert({ where: { id: 31 }, update: {}, create: { id: 31, categoryId: social.id, name: 'Pixiv Fanbox', prices: { create: [{ duration: '1 месяц', basePrice: 7, commission: 1, total: 8 }] } } })
  await prisma.service.upsert({ where: { id: 32 }, update: {}, create: { id: 32, categoryId: social.id, name: 'Ko-fi', prices: { create: [{ duration: '1 месяц', basePrice: 7, commission: 1, total: 8 }] } } })
  await prisma.service.upsert({ where: { id: 33 }, update: {}, create: { id: 33, categoryId: social.id, name: 'Boosty', prices: { create: [{ duration: '1 месяц', basePrice: 7, commission: 1, total: 8 }] } } })
  await prisma.service.upsert({ where: { id: 34 }, update: {}, create: { id: 34, categoryId: social.id, name: 'Makeship', prices: { create: [{ duration: '1 месяц', basePrice: 8, commission: 2, total: 10 }] } } })
  await prisma.service.upsert({ where: { id: 35 }, update: {}, create: { id: 35, categoryId: social.id, name: 'Gumroad', prices: { create: [{ duration: '1 месяц', basePrice: 7, commission: 1, total: 8 }] } } })

  // Design (ids 36-40)
  await prisma.service.upsert({ where: { id: 36 }, update: {}, create: { id: 36, categoryId: design.id, name: 'Canva Pro', prices: { create: [{ duration: '1 месяц', basePrice: 13, commission: 2, total: 15 }, { duration: '1 год', basePrice: 121, commission: 24, total: 145 }] } } })
  await prisma.service.upsert({ where: { id: 37 }, update: {}, create: { id: 37, categoryId: design.id, name: 'Figma', prices: { create: [{ duration: '1 месяц', basePrice: 13, commission: 2, total: 15 }, { duration: '1 год', basePrice: 125, commission: 25, total: 150 }] } } })
  await prisma.service.upsert({ where: { id: 38 }, update: {}, create: { id: 38, categoryId: design.id, name: 'CapCut Pro', prices: { create: [{ duration: '1 месяц', basePrice: 8, commission: 2, total: 10 }, { duration: '1 год', basePrice: 83, commission: 17, total: 100 }] } } })
  await prisma.service.upsert({ where: { id: 39 }, update: {}, create: { id: 39, categoryId: design.id, name: 'Adobe Creative', prices: { create: [{ duration: '1 месяц', basePrice: 50, commission: 10, total: 60 }, { duration: '1 год', basePrice: 542, commission: 108, total: 650 }] } } })
  await prisma.service.upsert({ where: { id: 40 }, update: {}, create: { id: 40, categoryId: design.id, name: 'Fotor Pro', prices: { create: [{ duration: '1 месяц', basePrice: 8, commission: 2, total: 10 }, { duration: '1 год', basePrice: 75, commission: 15, total: 90 }] } } })

  // Dev (ids 41-48)
  await prisma.service.upsert({ where: { id: 41 }, update: {}, create: { id: 41, categoryId: dev.id, name: 'Hetzner', prices: { create: [{ duration: '1 месяц', basePrice: 10, commission: 2, total: 12 }, { duration: '3 месяца', basePrice: 27, commission: 5, total: 32 }] } } })
  await prisma.service.upsert({ where: { id: 42 }, update: {}, create: { id: 42, categoryId: dev.id, name: 'Javarush', prices: { create: [{ duration: '1 месяц', basePrice: 15, commission: 3, total: 18 }, { duration: '1 год', basePrice: 150, commission: 30, total: 180 }] } } })
  await prisma.service.upsert({ where: { id: 43 }, update: {}, create: { id: 43, categoryId: dev.id, name: 'TradingView', prices: { create: [{ duration: '1 месяц', basePrice: 15, commission: 3, total: 18 }, { duration: '1 год', basePrice: 150, commission: 30, total: 180 }] } } })
  await prisma.service.upsert({ where: { id: 44 }, update: {}, create: { id: 44, categoryId: dev.id, name: 'iMazing', prices: { create: [{ duration: 'Лицензия', basePrice: 33, commission: 7, total: 40 }] } } })
  await prisma.service.upsert({ where: { id: 45 }, update: {}, create: { id: 45, categoryId: dev.id, name: 'JetBrains', prices: { create: [{ duration: '1 месяц', basePrice: 21, commission: 4, total: 25 }, { duration: '1 год', basePrice: 208, commission: 42, total: 250 }] } } })
  await prisma.service.upsert({ where: { id: 46 }, update: {}, create: { id: 46, categoryId: dev.id, name: 'Obsidian', prices: { create: [{ duration: '1 месяц', basePrice: 8, commission: 2, total: 10 }, { duration: '1 год', basePrice: 83, commission: 17, total: 100 }] } } })
  await prisma.service.upsert({ where: { id: 47 }, update: {}, create: { id: 47, categoryId: dev.id, name: 'Xsolla', prices: { create: [{ duration: '1 месяц', basePrice: 13, commission: 2, total: 15 }] } } })
  await prisma.service.upsert({ where: { id: 48 }, update: {}, create: { id: 48, categoryId: dev.id, name: 'Exaroton', prices: { create: [{ duration: '1 месяц', basePrice: 10, commission: 2, total: 12 }] } } })

  // Cloud (ids 49-55)
  await prisma.service.upsert({ where: { id: 49 }, update: {}, create: { id: 49, categoryId: cloud.id, name: 'Google Workspace', prices: { create: [{ duration: '1 месяц', basePrice: 8, commission: 2, total: 10 }, { duration: '1 год', basePrice: 83, commission: 17, total: 100 }] } } })
  await prisma.service.upsert({ where: { id: 50 }, update: {}, create: { id: 50, categoryId: cloud.id, name: 'Google One', prices: { create: [{ duration: '1 месяц', basePrice: 4, commission: 1, total: 5 }, { duration: '1 год', basePrice: 42, commission: 8, total: 50 }] } } })
  await prisma.service.upsert({ where: { id: 51 }, update: {}, create: { id: 51, categoryId: cloud.id, name: 'Zoom Pro', prices: { create: [{ duration: '1 месяц', basePrice: 15, commission: 3, total: 18 }, { duration: '1 год', basePrice: 150, commission: 30, total: 180 }] } } })
  await prisma.service.upsert({ where: { id: 52 }, update: {}, create: { id: 52, categoryId: cloud.id, name: 'Microsoft 365', prices: { create: [{ duration: '1 месяц', basePrice: 8, commission: 2, total: 10 }, { duration: '1 год', basePrice: 83, commission: 17, total: 100 }] } } })
  await prisma.service.upsert({ where: { id: 53 }, update: {}, create: { id: 53, categoryId: cloud.id, name: 'Apple ID', prices: { create: [{ duration: '1 месяц', basePrice: 10, commission: 2, total: 12 }] } } })
  await prisma.service.upsert({ where: { id: 54 }, update: {}, create: { id: 54, categoryId: cloud.id, name: 'Miro', prices: { create: [{ duration: '1 месяц', basePrice: 10, commission: 2, total: 12 }, { duration: '1 год', basePrice: 100, commission: 20, total: 120 }] } } })
  await prisma.service.upsert({ where: { id: 55 }, update: {}, create: { id: 55, categoryId: cloud.id, name: 'Google Play', prices: { create: [{ duration: '$10 баланс', basePrice: 10, commission: 2, total: 12 }, { duration: '$25 баланс', basePrice: 25, commission: 3, total: 28 }] } } })

  // Travel (ids 56-60)
  await prisma.service.upsert({ where: { id: 56 }, update: {}, create: { id: 56, categoryId: travel.id, name: 'Airalo eSIM', prices: { create: [{ duration: '7 дней', basePrice: 10, commission: 2, total: 12 }, { duration: '30 дней', basePrice: 21, commission: 4, total: 25 }] } } })
  await prisma.service.upsert({ where: { id: 57 }, update: {}, create: { id: 57, categoryId: travel.id, name: 'Airbnb', prices: { create: [{ duration: 'Оплата', basePrice: 21, commission: 4, total: 25 }] } } })
  await prisma.service.upsert({ where: { id: 58 }, update: {}, create: { id: 58, categoryId: travel.id, name: 'Booking.com', prices: { create: [{ duration: 'Оплата', basePrice: 21, commission: 4, total: 25 }] } } })
  await prisma.service.upsert({ where: { id: 59 }, update: {}, create: { id: 59, categoryId: travel.id, name: 'Agoda', prices: { create: [{ duration: 'Оплата', basePrice: 21, commission: 4, total: 25 }] } } })
  await prisma.service.upsert({ where: { id: 60 }, update: {}, create: { id: 60, categoryId: travel.id, name: 'Авиабилеты', prices: { create: [{ duration: 'Оплата', basePrice: 25, commission: 5, total: 30 }] } } })

  // Home & VPN (ids 61-65)
  await prisma.service.upsert({ where: { id: 61 }, update: {}, create: { id: 61, categoryId: home.id, name: 'NordVPN', prices: { create: [{ duration: '1 месяц', basePrice: 10, commission: 2, total: 12 }, { duration: '1 год', basePrice: 46, commission: 9, total: 55 }] } } })
  await prisma.service.upsert({ where: { id: 62 }, update: {}, create: { id: 62, categoryId: home.id, name: '1Password', prices: { create: [{ duration: '1 месяц', basePrice: 4, commission: 1, total: 5 }, { duration: '1 год', basePrice: 38, commission: 7, total: 45 }] } } })
  await prisma.service.upsert({ where: { id: 63 }, update: {}, create: { id: 63, categoryId: home.id, name: 'iCloud+', prices: { create: [{ duration: '1 месяц', basePrice: 4, commission: 1, total: 5 }, { duration: '1 год', basePrice: 42, commission: 8, total: 50 }] } } })
  await prisma.service.upsert({ where: { id: 64 }, update: {}, create: { id: 64, categoryId: home.id, name: 'Surfshark', prices: { create: [{ duration: '1 месяц', basePrice: 8, commission: 2, total: 10 }, { duration: '1 год', basePrice: 33, commission: 7, total: 40 }] } } })
  await prisma.service.upsert({ where: { id: 65 }, update: {}, create: { id: 65, categoryId: home.id, name: 'Dropbox', prices: { create: [{ duration: '1 месяц', basePrice: 10, commission: 2, total: 12 }, { duration: '1 год', basePrice: 100, commission: 20, total: 120 }] } } })

  // Education (ids 66-69)
  await prisma.service.upsert({ where: { id: 66 }, update: {}, create: { id: 66, categoryId: education.id, name: 'GeoGuessr', prices: { create: [{ duration: '1 месяц', basePrice: 4, commission: 1, total: 5 }, { duration: '1 год', basePrice: 40, commission: 8, total: 48 }] } } })
  await prisma.service.upsert({ where: { id: 67 }, update: {}, create: { id: 67, categoryId: education.id, name: 'Chess.com', prices: { create: [{ duration: '1 месяц', basePrice: 4, commission: 1, total: 5 }, { duration: '1 год', basePrice: 42, commission: 8, total: 50 }] } } })
  await prisma.service.upsert({ where: { id: 68 }, update: {}, create: { id: 68, categoryId: education.id, name: 'Quizlet Plus', prices: { create: [{ duration: '1 месяц', basePrice: 7, commission: 1, total: 8 }, { duration: '1 год', basePrice: 33, commission: 7, total: 40 }] } } })
  await prisma.service.upsert({ where: { id: 69 }, update: {}, create: { id: 69, categoryId: education.id, name: 'itch.io', prices: { create: [{ duration: 'Оплата', basePrice: 13, commission: 2, total: 15 }] } } })

  const streaming = await prisma.category.upsert({
    where: { slug: 'streaming' },
    update: {},
    create: { name: 'Стриминг', slug: 'streaming', emoji: '🎬' },
  })

  const gaming = await prisma.category.upsert({
    where: { slug: 'gaming' },
    update: {},
    create: { name: 'Игры', slug: 'gaming', emoji: '🎮' },
  })

  // Streaming (ids 72-81)
  await prisma.service.upsert({ where: { id: 72 }, update: {}, create: { id: 72, categoryId: streaming.id, name: 'Netflix', prices: { create: [{ duration: '1 месяц', basePrice: 17, commission: 3, total: 20 }, { duration: '3 месяца', basePrice: 47, commission: 8, total: 55 }, { duration: '1 год', basePrice: 170, commission: 30, total: 200 }] } } })
  await prisma.service.upsert({ where: { id: 73 }, update: {}, create: { id: 73, categoryId: streaming.id, name: 'Disney+', prices: { create: [{ duration: '1 месяц', basePrice: 10, commission: 2, total: 12 }, { duration: '3 месяца', basePrice: 28, commission: 4, total: 32 }, { duration: '1 год', basePrice: 96, commission: 14, total: 110 }] } } })
  await prisma.service.upsert({ where: { id: 74 }, update: {}, create: { id: 74, categoryId: streaming.id, name: 'HBO Max', prices: { create: [{ duration: '1 месяц', basePrice: 13, commission: 2, total: 15 }, { duration: '3 месяца', basePrice: 35, commission: 5, total: 40 }, { duration: '1 год', basePrice: 122, commission: 18, total: 140 }] } } })
  await prisma.service.upsert({ where: { id: 75 }, update: {}, create: { id: 75, categoryId: streaming.id, name: 'Apple TV+', prices: { create: [{ duration: '1 месяц', basePrice: 10, commission: 2, total: 12 }, { duration: '1 год', basePrice: 100, commission: 20, total: 120 }] } } })
  await prisma.service.upsert({ where: { id: 76 }, update: {}, create: { id: 76, categoryId: streaming.id, name: 'Crunchyroll', prices: { create: [{ duration: '1 месяц', basePrice: 8, commission: 2, total: 10 }, { duration: '3 месяца', basePrice: 23, commission: 4, total: 27 }, { duration: '1 год', basePrice: 83, commission: 12, total: 95 }] } } })
  await prisma.service.upsert({ where: { id: 77 }, update: {}, create: { id: 77, categoryId: streaming.id, name: 'Kinopoisk HD', prices: { create: [{ duration: '1 месяц', basePrice: 4, commission: 1, total: 5 }, { duration: '3 месяца', basePrice: 11, commission: 2, total: 13 }, { duration: '1 год', basePrice: 39, commission: 6, total: 45 }] } } })
  await prisma.service.upsert({ where: { id: 78 }, update: {}, create: { id: 78, categoryId: streaming.id, name: 'Amazon Prime', prices: { create: [{ duration: '1 месяц', basePrice: 10, commission: 2, total: 12 }, { duration: '1 год', basePrice: 100, commission: 15, total: 115 }] } } })
  await prisma.service.upsert({ where: { id: 79 }, update: {}, create: { id: 79, categoryId: streaming.id, name: 'Apple Music', prices: { create: [{ duration: '1 месяц', basePrice: 10, commission: 2, total: 12 }, { duration: '1 год', basePrice: 100, commission: 15, total: 115 }] } } })
  await prisma.service.upsert({ where: { id: 80 }, update: {}, create: { id: 80, categoryId: streaming.id, name: 'Tidal', prices: { create: [{ duration: '1 месяц', basePrice: 10, commission: 2, total: 12 }, { duration: '1 год', basePrice: 100, commission: 15, total: 115 }] } } })
  await prisma.service.upsert({ where: { id: 81 }, update: {}, create: { id: 81, categoryId: streaming.id, name: 'Deezer', prices: { create: [{ duration: '1 месяц', basePrice: 8, commission: 2, total: 10 }, { duration: '1 год', basePrice: 83, commission: 12, total: 95 }] } } })

  // Gaming (ids 82-86)
  await prisma.service.upsert({ where: { id: 82 }, update: {}, create: { id: 82, categoryId: gaming.id, name: 'Xbox Game Pass', prices: { create: [{ duration: '1 месяц', basePrice: 15, commission: 3, total: 18 }, { duration: '3 месяца', basePrice: 44, commission: 6, total: 50 }] } } })
  await prisma.service.upsert({ where: { id: 83 }, update: {}, create: { id: 83, categoryId: gaming.id, name: 'PlayStation Plus', prices: { create: [{ duration: '1 месяц', basePrice: 15, commission: 3, total: 18 }, { duration: '3 месяца', basePrice: 44, commission: 6, total: 50 }, { duration: '1 год', basePrice: 155, commission: 25, total: 180 }] } } })
  await prisma.service.upsert({ where: { id: 84 }, update: {}, create: { id: 84, categoryId: gaming.id, name: 'EA Play', prices: { create: [{ duration: '1 месяц', basePrice: 7, commission: 1, total: 8 }, { duration: '1 год', basePrice: 70, commission: 10, total: 80 }] } } })
  await prisma.service.upsert({ where: { id: 85 }, update: {}, create: { id: 85, categoryId: gaming.id, name: 'Nintendo Switch', prices: { create: [{ duration: '3 месяца', basePrice: 10, commission: 2, total: 12 }, { duration: '1 год', basePrice: 33, commission: 5, total: 38 }] } } })
  await prisma.service.upsert({ where: { id: 86 }, update: {}, create: { id: 86, categoryId: gaming.id, name: 'Epic Games', prices: { create: [{ duration: '$10 баланс', basePrice: 10, commission: 2, total: 12 }, { duration: '$25 баланс', basePrice: 25, commission: 3, total: 28 }, { duration: '$50 баланс', basePrice: 50, commission: 5, total: 55 }] } } })

  // Dev additions (ids 90-92)
  await prisma.service.upsert({ where: { id: 90 }, update: {}, create: { id: 90, categoryId: dev.id, name: 'GitHub Copilot', prices: { create: [{ duration: '1 месяц', basePrice: 10, commission: 2, total: 12 }, { duration: '1 год', basePrice: 100, commission: 15, total: 115 }] } } })
  await prisma.service.upsert({ where: { id: 91 }, update: {}, create: { id: 91, categoryId: dev.id, name: 'Vercel Pro', prices: { create: [{ duration: '1 месяц', basePrice: 19, commission: 3, total: 22 }, { duration: '1 год', basePrice: 190, commission: 30, total: 220 }] } } })
  await prisma.service.upsert({ where: { id: 92 }, update: {}, create: { id: 92, categoryId: dev.id, name: 'DigitalOcean', prices: { create: [{ duration: '$10 кредиты', basePrice: 10, commission: 2, total: 12 }, { duration: '$50 кредиты', basePrice: 50, commission: 8, total: 58 }] } } })

  // Home additions (ids 93-95)
  await prisma.service.upsert({ where: { id: 93 }, update: {}, create: { id: 93, categoryId: home.id, name: 'ExpressVPN', prices: { create: [{ duration: '1 месяц', basePrice: 13, commission: 2, total: 15 }, { duration: '1 год', basePrice: 70, commission: 10, total: 80 }] } } })
  await prisma.service.upsert({ where: { id: 94 }, update: {}, create: { id: 94, categoryId: home.id, name: 'ProtonVPN', prices: { create: [{ duration: '1 месяц', basePrice: 10, commission: 2, total: 12 }, { duration: '1 год', basePrice: 48, commission: 7, total: 55 }] } } })
  await prisma.service.upsert({ where: { id: 95 }, update: {}, create: { id: 95, categoryId: home.id, name: 'Bitwarden', prices: { create: [{ duration: '1 год', basePrice: 10, commission: 2, total: 12 }] } } })

  // Education additions (ids 87-89)
  await prisma.service.upsert({ where: { id: 87 }, update: {}, create: { id: 87, categoryId: education.id, name: 'Notion', prices: { create: [{ duration: '1 месяц', basePrice: 10, commission: 2, total: 12 }, { duration: '1 год', basePrice: 100, commission: 15, total: 115 }] } } })
  await prisma.service.upsert({ where: { id: 88 }, update: {}, create: { id: 88, categoryId: education.id, name: 'Grammarly', prices: { create: [{ duration: '1 месяц', basePrice: 13, commission: 2, total: 15 }, { duration: '1 год', basePrice: 122, commission: 18, total: 140 }] } } })
  await prisma.service.upsert({ where: { id: 89 }, update: {}, create: { id: 89, categoryId: education.id, name: 'Todoist Pro', prices: { create: [{ duration: '1 месяц', basePrice: 4, commission: 1, total: 5 }, { duration: '1 год', basePrice: 41, commission: 7, total: 48 }] } } })

  // Payment (ids 70-71)
  await prisma.service.upsert({ where: { id: 70 }, update: {}, create: { id: 70, categoryId: payment.id, name: 'Любой сервис', prices: { create: [{ duration: 'До $50', basePrice: 46, commission: 9, total: 55 }, { duration: 'До $100', basePrice: 90, commission: 18, total: 108 }, { duration: 'До $200', basePrice: 179, commission: 36, total: 215 }] } } })
  await prisma.service.upsert({ where: { id: 71 }, update: {}, create: { id: 71, categoryId: payment.id, name: 'Stripe', prices: { create: [{ duration: 'Оплата', basePrice: 21, commission: 4, total: 25 }] } } })

  // Merge: move all services from 'games' category into 'gaming'
  const gamesCat = await prisma.category.findUnique({ where: { slug: 'games' } })
  const gamingCat = await prisma.category.findUnique({ where: { slug: 'gaming' } })
  if (gamesCat && gamingCat) {
    await prisma.service.updateMany({
      where: { categoryId: gamesCat.id },
      data: { categoryId: gamingCat.id },
    })
  }

  // Disable "Любой сервис"
  await prisma.service.updateMany({
    where: { name: 'Любой сервис' },
    data: { isActive: false },
  })

  console.log('Seed completed!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
