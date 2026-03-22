import { useState, useRef } from 'react'
import { Sparkles, Tv2, Gamepad2, MessageCircle, Palette, Code2, Cloud, Plane, Shield, GraduationCap, CreditCard } from 'lucide-react'
import type { SelectedService } from '../App'

const G = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

const CATEGORIES = [
  { slug: 'ai',        name: 'ИИ-сервисы',   icon: Sparkles },
  { slug: 'streaming', name: 'Стриминг',      icon: Tv2 },
  { slug: 'gaming',    name: 'Игры',          icon: Gamepad2 },
  { slug: 'social',    name: 'Соц. сети',     icon: MessageCircle },
  { slug: 'design',    name: 'Дизайн',        icon: Palette },
  { slug: 'dev',       name: 'Разработка',    icon: Code2 },
  { slug: 'cloud',     name: 'Облако',        icon: Cloud },
  { slug: 'travel',    name: 'Путешествия',   icon: Plane },
  { slug: 'home',      name: 'Дом и VPN',     icon: Shield },
  { slug: 'education', name: 'Обучение',      icon: GraduationCap },
  { slug: 'payment',   name: 'Оплата',        icon: CreditCard },
]

const SERVICES: SelectedService[] = [
  // ИИ-сервисы
  { id: 99, name: 'Тест $1',              category: 'ai', icon: G('openai.com'),       prices: [{ duration: '1 месяц', total: 1 }] },
  { id: 1,  name: 'ChatGPT Plus',           category: 'ai', icon: G('openai.com'),       prices: [{ duration: '1 месяц', total: 25 }, { duration: '3 месяца', total: 70 }, { duration: '1 год', total: 250 }] },
  { id: 2,  name: 'Claude Pro',             category: 'ai', icon: G('claude.ai'),        prices: [{ duration: '1 месяц', total: 25 }, { duration: '3 месяца', total: 70 }] },
  { id: 7,  name: 'Suno AI',               category: 'ai', icon: G('suno.com'),          prices: [{ duration: '1 месяц', total: 12 }, { duration: '3 месяца', total: 32 }] },
  { id: 8,  name: 'Gamma AI',              category: 'ai', icon: G('gamma.app'),         prices: [{ duration: '1 месяц', total: 12 }, { duration: '1 год', total: 120 }] },
  { id: 9,  name: 'DeepSeek',              category: 'ai', icon: G('deepseek.com'),      prices: [{ duration: '1 месяц', total: 8 }] },
  { id: 10, name: 'Cursor AI',             category: 'ai', icon: G('cursor.com'),        prices: [{ duration: '1 месяц', total: 22 }, { duration: '1 год', total: 220 }] },
  { id: 11, name: 'Krea AI',              category: 'ai', icon: G('krea.ai'),            prices: [{ duration: '1 месяц', total: 38 }, { duration: '1 год', total: 380 }] },
  { id: 12, name: 'OpenAI API',            category: 'ai', icon: G('openai.com'),        prices: [{ duration: '$10 кредиты', total: 12 }, { duration: '$50 кредиты', total: 58 }] },
  { id: 13, name: 'Kling AI',             category: 'ai', icon: G('klingai.com'),        prices: [{ duration: '1 месяц', total: 18 }, { duration: '3 месяца', total: 48 }] },
  { id: 14, name: 'Freepik Premium',       category: 'ai', icon: G('freepik.com'),       prices: [{ duration: '1 месяц', total: 15 }, { duration: '1 год', total: 150 }] },
  { id: 15, name: 'Runway AI',            category: 'ai', icon: G('runwayml.com'),       prices: [{ duration: '1 месяц', total: 18 }, { duration: '3 месяца', total: 50 }] },
  { id: 16, name: 'ElevenLabs',           category: 'ai', icon: G('elevenlabs.io'),      prices: [{ duration: '1 месяц', total: 7 }, { duration: '3 месяца', total: 18 }] },
  { id: 17, name: 'Candy AI',             category: 'ai', icon: G('candy.ai'),           prices: [{ duration: '1 месяц', total: 18 }] },
  { id: 18, name: 'Lensa AI',             category: 'ai', icon: G('lensa-ai.com'),       prices: [{ duration: '1 месяц', total: 8 }, { duration: '1 год', total: 32 }] },
  { id: 19, name: 'Higgsfield AI',        category: 'ai', icon: G('higgsfield.ai'),      prices: [{ duration: '1 месяц', total: 22 }] },
  { id: 20, name: 'Google Gemini Adv.',   category: 'ai', icon: G('gemini.google.com'),  prices: [{ duration: '1 месяц', total: 22 }, { duration: '1 год', total: 220 }] },
  { id: 21, name: 'Perplexity Pro',       category: 'ai', icon: G('perplexity.ai'),      prices: [{ duration: '1 месяц', total: 22 }, { duration: '1 год', total: 220 }] },
  { id: 22, name: 'Grok Premium',         category: 'ai', icon: G('x.ai'),               prices: [{ duration: '1 месяц', total: 18 }, { duration: '1 год', total: 180 }] },
  { id: 23, name: 'NanoBanana',           category: 'ai', icon: G('nanobanana.io'),      prices: [{ duration: '1 месяц', total: 12 }] },
  { id: 3,  name: 'Midjourney',           category: 'ai', icon: G('midjourney.com'),     prices: [{ duration: '1 месяц', total: 15 }, { duration: '3 месяца', total: 40 }] },

  // Стриминг и музыка
  { id: 72, name: 'Netflix',            category: 'streaming', icon: G('netflix.com'),        prices: [{ duration: '1 месяц', total: 20 }, { duration: '3 месяца', total: 55 }, { duration: '1 год', total: 200 }] },
  { id: 73, name: 'Disney+',            category: 'streaming', icon: G('disneyplus.com'),     prices: [{ duration: '1 месяц', total: 12 }, { duration: '3 месяца', total: 32 }, { duration: '1 год', total: 110 }] },
  { id: 74, name: 'HBO Max',            category: 'streaming', icon: G('max.com'),            prices: [{ duration: '1 месяц', total: 15 }, { duration: '3 месяца', total: 40 }, { duration: '1 год', total: 140 }] },
  { id: 75, name: 'Apple TV+',          category: 'streaming', icon: G('tv.apple.com'),       prices: [{ duration: '1 месяц', total: 12 }, { duration: '1 год', total: 120 }] },
  { id: 76, name: 'Crunchyroll',        category: 'streaming', icon: G('crunchyroll.com'),    prices: [{ duration: '1 месяц', total: 10 }, { duration: '3 месяца', total: 27 }, { duration: '1 год', total: 95 }] },
  { id: 77, name: 'Kinopoisk HD',       category: 'streaming', icon: G('kinopoisk.ru'),       prices: [{ duration: '1 месяц', total: 5 }, { duration: '3 месяца', total: 13 }, { duration: '1 год', total: 45 }] },
  { id: 78, name: 'Amazon Prime',       category: 'streaming', icon: G('primevideo.com'),     prices: [{ duration: '1 месяц', total: 12 }, { duration: '1 год', total: 115 }] },
  { id: 5,  name: 'Spotify',            category: 'streaming', icon: G('spotify.com'),        prices: [{ duration: '1 месяц', total: 8 }, { duration: '3 месяца', total: 22 }, { duration: '1 год', total: 80 }] },
  { id: 79, name: 'Apple Music',        category: 'streaming', icon: G('music.apple.com'),    prices: [{ duration: '1 месяц', total: 12 }, { duration: '1 год', total: 115 }] },
  { id: 80, name: 'Tidal',              category: 'streaming', icon: G('tidal.com'),          prices: [{ duration: '1 месяц', total: 12 }, { duration: '1 год', total: 115 }] },
  { id: 81, name: 'Deezer',             category: 'streaming', icon: G('deezer.com'),         prices: [{ duration: '1 месяц', total: 10 }, { duration: '1 год', total: 95 }] },

  // Игры
  { id: 82, name: 'Xbox Game Pass',     category: 'gaming', icon: G('xbox.com'),             prices: [{ duration: '1 месяц', total: 18 }, { duration: '3 месяца', total: 50 }] },
  { id: 83, name: 'PlayStation Plus',   category: 'gaming', icon: G('playstation.com'),      prices: [{ duration: '1 месяц', total: 18 }, { duration: '3 месяца', total: 50 }, { duration: '1 год', total: 180 }] },
  { id: 84, name: 'EA Play',            category: 'gaming', icon: G('ea.com'),               prices: [{ duration: '1 месяц', total: 8 }, { duration: '1 год', total: 80 }] },
  { id: 85, name: 'Nintendo Switch',    category: 'gaming', icon: G('nintendo.com'),         prices: [{ duration: '3 месяца', total: 12 }, { duration: '1 год', total: 38 }] },
  { id: 86, name: 'Epic Games',         category: 'gaming', icon: G('epicgames.com'),        prices: [{ duration: '$10 баланс', total: 12 }, { duration: '$25 баланс', total: 28 }, { duration: '$50 баланс', total: 55 }] },
  { id: 6,  name: 'Steam',              category: 'gaming', icon: G('store.steampowered.com'), prices: [{ duration: '$10 баланс', total: 12 }, { duration: '$25 баланс', total: 28 }] },

  // Социальные сети
  { id: 24, name: 'TikTok',              category: 'social', icon: G('tiktok.com'),      prices: [{ duration: '1 месяц', total: 8 }] },
  { id: 25, name: 'Patreon',             category: 'social', icon: G('patreon.com'),     prices: [{ duration: '1 месяц', total: 8 }, { duration: '3 месяца', total: 22 }] },
  { id: 26, name: 'OnlyFans',            category: 'social', icon: G('onlyfans.com'),    prices: [{ duration: '1 месяц', total: 12 }] },
  { id: 27, name: 'Faceit',             category: 'social', icon: G('faceit.com'),       prices: [{ duration: '1 месяц', total: 10 }, { duration: '3 месяца', total: 27 }] },
  { id: 28, name: 'YouTube Premium',     category: 'social', icon: G('youtube.com'),     prices: [{ duration: '1 месяц', total: 8 }, { duration: '1 год', total: 80 }] },
  { id: 29, name: 'Twitch',             category: 'social', icon: G('twitch.tv'),        prices: [{ duration: '1 месяц', total: 8 }] },
  { id: 30, name: 'Discord Nitro',       category: 'social', icon: G('discord.com'),     prices: [{ duration: '1 месяц', total: 12 }, { duration: '1 год', total: 120 }] },
  { id: 31, name: 'Pixiv Fanbox',        category: 'social', icon: G('fanbox.cc'),       prices: [{ duration: '1 месяц', total: 8 }] },
  { id: 32, name: 'Ko-fi',              category: 'social', icon: G('ko-fi.com'),        prices: [{ duration: '1 месяц', total: 8 }] },
  { id: 33, name: 'Boosty',             category: 'social', icon: G('boosty.to'),        prices: [{ duration: '1 месяц', total: 8 }] },
  { id: 34, name: 'Makeship',           category: 'social', icon: G('makeship.com'),     prices: [{ duration: '1 месяц', total: 10 }] },
  { id: 35, name: 'Gumroad',            category: 'social', icon: G('gumroad.com'),      prices: [{ duration: '1 месяц', total: 8 }] },

  // Дизайн / графика
  { id: 36, name: 'Canva Pro',          category: 'design', icon: G('canva.com'),        prices: [{ duration: '1 месяц', total: 15 }, { duration: '1 год', total: 145 }] },
  { id: 37, name: 'Figma',             category: 'design', icon: G('figma.com'),         prices: [{ duration: '1 месяц', total: 15 }, { duration: '1 год', total: 150 }] },
  { id: 38, name: 'CapCut Pro',         category: 'design', icon: G('capcut.com'),       prices: [{ duration: '1 месяц', total: 10 }, { duration: '1 год', total: 100 }] },
  { id: 39, name: 'Adobe Creative',     category: 'design', icon: G('adobe.com'),        prices: [{ duration: '1 месяц', total: 60 }, { duration: '1 год', total: 650 }] },
  { id: 40, name: 'Fotor Pro',          category: 'design', icon: G('fotor.com'),        prices: [{ duration: '1 месяц', total: 10 }, { duration: '1 год', total: 90 }] },

  // Разработка
  { id: 41, name: 'Hetzner',           category: 'dev', icon: G('hetzner.com'),          prices: [{ duration: '1 месяц', total: 12 }, { duration: '3 месяца', total: 32 }] },
  { id: 42, name: 'Javarush',          category: 'dev', icon: G('javarush.com'),         prices: [{ duration: '1 месяц', total: 18 }, { duration: '1 год', total: 180 }] },
  { id: 43, name: 'TradingView',        category: 'dev', icon: G('tradingview.com'),     prices: [{ duration: '1 месяц', total: 18 }, { duration: '1 год', total: 180 }] },
  { id: 44, name: 'iMazing',           category: 'dev', icon: G('imazing.com'),          prices: [{ duration: 'Лицензия', total: 40 }] },
  { id: 45, name: 'JetBrains',         category: 'dev', icon: G('jetbrains.com'),        prices: [{ duration: '1 месяц', total: 25 }, { duration: '1 год', total: 250 }] },
  { id: 46, name: 'Obsidian',          category: 'dev', icon: G('obsidian.md'),          prices: [{ duration: '1 месяц', total: 10 }, { duration: '1 год', total: 100 }] },
  { id: 47, name: 'Xsolla',            category: 'dev', icon: G('xsolla.com'),           prices: [{ duration: '1 месяц', total: 15 }] },
  { id: 48, name: 'Exaroton',          category: 'dev', icon: G('exaroton.com'),         prices: [{ duration: '1 месяц', total: 12 }] },
  { id: 90, name: 'GitHub Copilot',    category: 'dev', icon: G('github.com'),           prices: [{ duration: '1 месяц', total: 12 }, { duration: '1 год', total: 115 }] },
  { id: 91, name: 'Vercel Pro',        category: 'dev', icon: G('vercel.com'),           prices: [{ duration: '1 месяц', total: 22 }, { duration: '1 год', total: 220 }] },
  { id: 92, name: 'DigitalOcean',      category: 'dev', icon: G('digitalocean.com'),     prices: [{ duration: '$10 кредиты', total: 12 }, { duration: '$50 кредиты', total: 58 }] },

  // Облачные сервисы
  { id: 49, name: 'Google Workspace',  category: 'cloud', icon: G('workspace.google.com'), prices: [{ duration: '1 месяц', total: 10 }, { duration: '1 год', total: 100 }] },
  { id: 50, name: 'Google One',        category: 'cloud', icon: G('one.google.com'),     prices: [{ duration: '1 месяц', total: 5 }, { duration: '1 год', total: 50 }] },
  { id: 51, name: 'Zoom Pro',          category: 'cloud', icon: G('zoom.us'),            prices: [{ duration: '1 месяц', total: 18 }, { duration: '1 год', total: 180 }] },
  { id: 52, name: 'Microsoft 365',     category: 'cloud', icon: G('microsoft.com'),      prices: [{ duration: '1 месяц', total: 10 }, { duration: '1 год', total: 100 }] },
  { id: 53, name: 'Apple ID',          category: 'cloud', icon: G('apple.com'),          prices: [{ duration: '1 месяц', total: 12 }] },
  { id: 54, name: 'Miro',             category: 'cloud', icon: G('miro.com'),            prices: [{ duration: '1 месяц', total: 12 }, { duration: '1 год', total: 120 }] },
  { id: 55, name: 'Google Play',       category: 'cloud', icon: G('play.google.com'),    prices: [{ duration: '$10 баланс', total: 12 }, { duration: '$25 баланс', total: 28 }] },

  // Путешествия / eSIM
  { id: 56, name: 'Airalo eSIM',       category: 'travel', icon: G('airalo.com'),        prices: [{ duration: '7 дней', total: 12 }, { duration: '30 дней', total: 25 }] },
  { id: 57, name: 'Airbnb',           category: 'travel', icon: G('airbnb.com'),         prices: [{ duration: 'Оплата', total: 25 }] },
  { id: 58, name: 'Booking.com',       category: 'travel', icon: G('booking.com'),       prices: [{ duration: 'Оплата', total: 25 }] },
  { id: 59, name: 'Agoda',            category: 'travel', icon: G('agoda.com'),          prices: [{ duration: 'Оплата', total: 25 }] },
  { id: 60, name: 'Авиабилеты',        category: 'travel', icon: G('aviasales.ru'),      prices: [{ duration: 'Оплата', total: 30 }] },

  // Дом и безопасность
  { id: 61, name: 'NordVPN',          category: 'home', icon: G('nordvpn.com'),          prices: [{ duration: '1 месяц', total: 12 }, { duration: '1 год', total: 55 }] },
  { id: 62, name: '1Password',        category: 'home', icon: G('1password.com'),        prices: [{ duration: '1 месяц', total: 5 }, { duration: '1 год', total: 45 }] },
  { id: 63, name: 'iCloud+',          category: 'home', icon: G('icloud.com'),           prices: [{ duration: '1 месяц', total: 5 }, { duration: '1 год', total: 50 }] },
  { id: 64, name: 'Surfshark',        category: 'home', icon: G('surfshark.com'),        prices: [{ duration: '1 месяц', total: 10 }, { duration: '1 год', total: 40 }] },
  { id: 65, name: 'Dropbox',          category: 'home', icon: G('dropbox.com'),          prices: [{ duration: '1 месяц', total: 12 }, { duration: '1 год', total: 120 }] },
  { id: 93, name: 'ExpressVPN',       category: 'home', icon: G('expressvpn.com'),       prices: [{ duration: '1 месяц', total: 15 }, { duration: '1 год', total: 80 }] },
  { id: 94, name: 'ProtonVPN',        category: 'home', icon: G('protonvpn.com'),        prices: [{ duration: '1 месяц', total: 12 }, { duration: '1 год', total: 55 }] },
  { id: 95, name: 'Bitwarden',        category: 'home', icon: G('bitwarden.com'),        prices: [{ duration: '1 год', total: 12 }] },

  // Обучение / игры
  { id: 4,  name: 'Duolingo Plus',    category: 'education', icon: G('duolingo.com'),    prices: [{ duration: '1 месяц', total: 10 }, { duration: '1 год', total: 80 }] },
  { id: 66, name: 'GeoGuessr',        category: 'education', icon: G('geoguessr.com'),   prices: [{ duration: '1 месяц', total: 5 }, { duration: '1 год', total: 48 }] },
  { id: 67, name: 'Chess.com',        category: 'education', icon: G('chess.com'),       prices: [{ duration: '1 месяц', total: 5 }, { duration: '1 год', total: 50 }] },
  { id: 68, name: 'Quizlet Plus',     category: 'education', icon: G('quizlet.com'),     prices: [{ duration: '1 месяц', total: 8 }, { duration: '1 год', total: 40 }] },
  { id: 69, name: 'itch.io',          category: 'education', icon: G('itch.io'),         prices: [{ duration: 'Оплата', total: 15 }] },
  { id: 87, name: 'Notion',           category: 'education', icon: G('notion.so'),       prices: [{ duration: '1 месяц', total: 12 }, { duration: '1 год', total: 115 }] },
  { id: 88, name: 'Grammarly',        category: 'education', icon: G('grammarly.com'),   prices: [{ duration: '1 месяц', total: 15 }, { duration: '1 год', total: 140 }] },
  { id: 89, name: 'Todoist Pro',      category: 'education', icon: G('todoist.com'),     prices: [{ duration: '1 месяц', total: 5 }, { duration: '1 год', total: 48 }] },

  // Оплата зарубежных сервисов
  { id: 70, name: 'Любой сервис',     category: 'payment', icon: G('paypal.com'),        prices: [{ duration: 'До $50', total: 55 }, { duration: 'До $100', total: 108 }, { duration: 'До $200', total: 215 }] },
  { id: 71, name: 'Stripe',           category: 'payment', icon: G('stripe.com'),        prices: [{ duration: 'Оплата', total: 25 }] },
]

type Props = {
  onSelectService: (service: SelectedService) => void
  onGoToOrders: () => void
  onHowItWorks: () => void
}

export default function CatalogPage({ onSelectService, onGoToOrders, onHowItWorks }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('ai')
  const [search, setSearch] = useState('')
  const touchStartX = useRef<number>(0)
  const touchStartY = useRef<number>(0)

  const isSearching = search.trim().length > 0
  const filtered = isSearching
    ? SERVICES.filter(s =>
        s.name.toLowerCase().split(/\s+/).some(word => word.startsWith(search.toLowerCase()))
      )
    : SERVICES.filter(s => s.category === activeCategory)
  const currentIndex = CATEGORIES.findIndex(c => c.slug === activeCategory)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return
    if (dx < 0 && currentIndex < CATEGORIES.length - 1) {
      setActiveCategory(CATEGORIES[currentIndex + 1].slug)
    } else if (dx > 0 && currentIndex > 0) {
      setActiveCategory(CATEGORIES[currentIndex - 1].slug)
    }
  }

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
        {CATEGORIES.map(cat => (
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
