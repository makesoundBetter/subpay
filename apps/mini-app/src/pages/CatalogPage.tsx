import { useState } from 'react'
import type { SelectedService } from '../App'

const CATEGORIES = [
  { slug: 'ai', name: 'AI', emoji: '🤖' },
  { slug: 'education', name: 'Образование', emoji: '📚' },
  { slug: 'games', name: 'Игры', emoji: '🎮' },
  { slug: 'design', name: 'Дизайн', emoji: '🎨' },
  { slug: 'other', name: 'Другое', emoji: '📦' },
]

const SERVICES: SelectedService[] = [
  {
    id: 1, name: 'ChatGPT Plus', category: 'ai', emoji: '🤖',
    prices: [
      { duration: '1 месяц', total: 25 },
      { duration: '3 месяца', total: 70 },
      { duration: '1 год', total: 250 },
    ],
  },
  {
    id: 2, name: 'Claude Pro', category: 'ai', emoji: '🧠',
    prices: [
      { duration: '1 месяц', total: 25 },
      { duration: '3 месяца', total: 70 },
    ],
  },
  {
    id: 3, name: 'Midjourney', category: 'design', emoji: '🎨',
    prices: [
      { duration: '1 месяц', total: 15 },
      { duration: '3 месяца', total: 40 },
    ],
  },
  {
    id: 4, name: 'Duolingo Plus', category: 'education', emoji: '🦜',
    prices: [
      { duration: '1 месяц', total: 10 },
      { duration: '1 год', total: 80 },
    ],
  },
  {
    id: 5, name: 'Spotify', category: 'other', emoji: '🎵',
    prices: [
      { duration: '1 месяц', total: 8 },
      { duration: '3 месяца', total: 22 },
      { duration: '1 год', total: 80 },
    ],
  },
  {
    id: 6, name: 'Steam', category: 'games', emoji: '🎮',
    prices: [
      { duration: '1 месяц', total: 5 },
    ],
  },
]

type Props = {
  onSelectService: (service: SelectedService) => void
  onGoToOrders: () => void
}

export default function CatalogPage({ onSelectService, onGoToOrders }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('ai')

  const filtered = SERVICES.filter(s => s.category === activeCategory)

  return (
    <div className="page">
      <div className="header">
        <h1>Subpay</h1>
        <button className="orders-btn" onClick={onGoToOrders}>Мои заявки</button>
      </div>

      <div className="categories">
        {CATEGORIES.map(cat => (
          <button
            key={cat.slug}
            className={`cat-btn ${activeCategory === cat.slug ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.slug)}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      <div className="services">
        {filtered.map(service => (
          <div key={service.id} className="service-card" onClick={() => onSelectService(service)}>
            <span className="service-emoji">{service.emoji}</span>
            <div className="service-info">
              <div className="service-name">{service.name}</div>
              <div className="service-price">от ${service.prices[0].total}</div>
            </div>
            <span className="arrow">›</span>
          </div>
        ))}
      </div>
    </div>
  )
}
