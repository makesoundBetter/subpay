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
      categoryId: design.id,
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
      categoryId: games.id,
      name: 'Steam',
      prices: {
        create: [
          { duration: '1 месяц', basePrice: 4, commission: 1, total: 5 },
        ],
      },
    },
  })

  console.log('Seed completed!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
