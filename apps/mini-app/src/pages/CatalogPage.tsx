import { useState, useRef, useEffect } from 'react'
import { Sparkles, Tv2, Gamepad2, MessageCircle, Palette, Code2, Cloud, Plane, Shield, GraduationCap, CreditCard } from 'lucide-react'
import type { SelectedService } from '../App'
import { API_URL } from '../config'

const G = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

const CATEGORY_META: Record<string, { name: string; icon: any }> = {
  ai:        { name: 'ИИ-сервисы',   icon: Sparkles },
  streaming: { name: 'Стриминг',      icon: Tv2 },
  gaming:    { name: 'Игры',          icon: Gamepad2 },
  social:    { name: 'Соц. сети',     icon: MessageCircle },
  design:    { name: 'Дизайн',        icon: Palette },
  dev:       { name: 'Разработка',    icon: Code2 },
  cloud:     { name: 'Облако',        icon: Cloud },
  travel:    { name: 'Путешествия',   icon: Plane },
  home:      { name: 'Дом и VPN',     icon: Shield },
  education: { name: 'Обучение',      icon: GraduationCap },
  payment:   { name: 'Оплата',        icon: CreditCard },
}

type Props = {
  onSelectService: (service: SelectedService) => void
  onGoToOrders: () => void
  onHowItWorks: () => void
}

export default function CatalogPage({ onSelectService, onGoToOrders, onHowItWorks }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('ai')
  const [search, setSearch] = useState('')
  const [services, setServices] = useState<SelectedService[]>([])
  const [categories, setCategories] = useState<{ slug: string; name: string; icon: any }[]>([])
  const [loadError, setLoadError] = useState(false)
  const touchStartX = useRef<number>(0)
  const touchStartY = useRef<number>(0)

  useEffect(() => {
    fetch(`${API_URL}/services`)
      .then(r => r.json())
      .then((data: any[]) => {
        const cats = data.map(cat => ({
          slug: cat.slug,
          name: CATEGORY_META[cat.slug]?.name ?? cat.name,
          icon: CATEGORY_META[cat.slug]?.icon ?? Sparkles,
        }))
        const svcs: SelectedService[] = data.flatMap(cat =>
          cat.services.map((s: any) => ({
            id: s.id,
            name: s.name,
            category: cat.slug,
            icon: s.imageUrl ?? G(s.name.toLowerCase().replace(/\s+/g, '') + '.com'),
            prices: s.prices.map((p: any) => ({ duration: p.duration, total: p.total })),
          }))
        )
        setCategories(cats)
        setServices(svcs)
        if (cats.length > 0) setActiveCategory(cats[0].slug)
      })
      .catch(() => setLoadError(true))
  }, [])

  const isSearching = search.trim().length > 0
  const filtered = isSearching
    ? services.filter(s =>
        s.name?.toLowerCase().split(/\s+/).some(word => word.startsWith(search.toLowerCase()))
      )
    : services.filter(s => s.category === activeCategory)
  const currentIndex = categories.findIndex(c => c.slug === activeCategory)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return
    if (dx < 0 && currentIndex < categories.length - 1) {
      setActiveCategory(categories[currentIndex + 1].slug)
    } else if (dx > 0 && currentIndex > 0) {
      setActiveCategory(categories[currentIndex - 1].slug)
    }
  }

  if (loadError) return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', color: '#888' }}>
        <p>Не удалось загрузить каталог</p>
        <button className="orders-btn" onClick={() => { setLoadError(false); location.reload() }}>Попробовать снова</button>
      </div>
    </div>
  )

  return (
    <div className="page">
      <div className="header">
        <h1>Subpay Service</h1>
        <div className="header-btns">
          <button className="orders-btn" onClick={onHowItWorks}>Как это работает</button>
          <button className="orders-btn" onClick={onGoToOrders}>Мои заявки</button>
        </div>
      </div>

      <div className="search-wrap">
        <input
          className="search-input"
          type="text"
          placeholder="Поиск сервиса..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {isSearching && (
          <button className="search-clear" onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {!isSearching && <div className="categories">
        {categories.map(cat => (
          <button
            key={cat.slug}
            className={`cat-btn ${activeCategory === cat.slug ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.slug)}
          >
            <cat.icon size={14} />
            {cat.name}
          </button>
        ))}
      </div>}

      <div className="services" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {filtered.map(service => (
          <div key={service.id} className="service-card" onClick={() => onSelectService(service)}>
            <img
              className="service-icon"
              src={service.icon}
              alt={service.name}
              onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3' }}
            />
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
