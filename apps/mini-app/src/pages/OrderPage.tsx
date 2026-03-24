import { useState } from 'react'
import type { SelectedService } from '../App'
import { MANAGER_URL } from '../config'

type Props = {
  service: SelectedService
  onBack: () => void
  onCryptoPayment: (orderId: number, paymentData: CryptoPaymentData) => void
}

export type CryptoPaymentData = {
  paymentId: string
  address: string
  amount: string
  currency: string
  cryptoCurrency: string
  totalUsd: number
  serviceName: string
}

const COINS = [
  { key: 'TON',        label: 'TON',        icon: '💎' },
  { key: 'USDT_TRC20', label: 'USDT TRC20', icon: '💵' },
  { key: 'USDT_ERC20', label: 'USDT ERC20', icon: '💵' },
  { key: 'ETH',        label: 'ETH',        icon: '🔷' },
  { key: 'USDC',       label: 'USDC',       icon: '🔵' },
  { key: 'SOL',        label: 'SOL',        icon: '🟣' },
]

export default function OrderPage({ service, onBack, onCryptoPayment }: Props) {
  const [selectedPrice, setSelectedPrice] = useState(service.prices[0])
  const [comment, setComment] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'TRANSFER' | 'CRYPTO'>('TRANSFER')
  const [cryptoCurrency, setCryptoCurrency] = useState('TON')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const tg = (window as any).Telegram?.WebApp
      const user = tg?.initDataUnsafe?.user

      if (!user?.id) {
        setError('Откройте приложение через Telegram')
        setLoading(false)
        return
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId: user.id,
          firstName: user.first_name ?? '',
          username: user.username ?? null,
          serviceId: service.id,
          serviceName: service.name,
          duration: selectedPrice.duration,
          totalPrice: selectedPrice.total,
          comment: comment.trim() || null,
          paymentMethod,
          cryptoCurrency: paymentMethod === 'CRYPTO' ? cryptoCurrency : null,
        }),
      })

      if (!res.ok) throw new Error('Ошибка сервера')

      const data = await res.json()

      if (paymentMethod === 'CRYPTO' && data.paymentData) {
        onCryptoPayment(data.orderId, {
          ...data.paymentData,
          cryptoCurrency,
          totalUsd: selectedPrice.total,
          serviceName: service.name,
        })
      } else {
        setSubmitted(true)
      }
    } catch (e) {
      setError('Не удалось отправить заявку. Попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="page center">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#ffffff' }}>
          <span className="order-status-dot" style={{ background: '#00bfff', boxShadow: '0 0 8px #00bfff', width: 12, height: 12, flexShrink: 0 }} />
          Заявка отправлена!
        </h2>
        <p style={{ color: '#ffffff' }}>Менеджер обработает заявку и свяжется с вами для оплаты.</p>
        <a
          className="btn-manager"
          href={MANAGER_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Написать менеджеру
        </a>
        <button className="btn-primary" onClick={onBack}>На главную</button>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="back-header">
        <button className="back-btn" onClick={onBack}>← Назад</button>
      </div>

      <div className="order-page-scroll">
        <div className="order-service">
          <img className="order-service-icon" src={service.icon} alt={service.name} />
          <h2>{service.name}</h2>
        </div>

        <div className="section-title">Выберите период</div>
        <div className="prices">
          {service.prices.map(price => (
            <div
              key={price.duration}
              className={`price-card ${selectedPrice.duration === price.duration ? 'active' : ''}`}
              onClick={() => setSelectedPrice(price)}
            >
              <span>{price.duration}</span>
              <span className="price-amount">${price.total}</span>
            </div>
          ))}
        </div>

        <div className="order-total">
          <span>Итого:</span>
          <span className="total-amount">${selectedPrice.total}</span>
        </div>

        <div className="section-title" style={{ marginTop: 20 }}>Способ оплаты</div>
        <div className="payment-method-toggle">
          <button
            className={`payment-method-btn ${paymentMethod === 'TRANSFER' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('TRANSFER')}
          >
            💳 Перевод
          </button>
          <button
            className={`payment-method-btn ${paymentMethod === 'CRYPTO' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('CRYPTO')}
          >
            ₿ Крипта
          </button>
        </div>

        {paymentMethod === 'CRYPTO' && (
          <>
            <div className="section-title" style={{ marginTop: 16 }}>Выберите монету</div>
            <div className="coin-grid">
              {COINS.map(coin => (
                <div
                  key={coin.key}
                  className={`coin-card ${cryptoCurrency === coin.key ? 'active' : ''}`}
                  onClick={() => setCryptoCurrency(coin.key)}
                >
                  <span className="coin-icon">{coin.icon}</span>
                  <span className="coin-label">{coin.label}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="section-title" style={{ marginTop: 20 }}>Комментарий (необязательно)</div>
        <textarea
          className="order-comment"
          placeholder="Например: нужен семейный план, есть промокод, особые пожелания..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          maxLength={300}
          rows={3}
        />

        {error && <p className="error-msg">{error}</p>}

        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Отправляем...' : paymentMethod === 'CRYPTO' ? 'Перейти к оплате' : 'Отправить заявку'}
        </button>

        <p className="order-note">
          {paymentMethod === 'CRYPTO'
            ? 'После нажатия вы получите адрес кошелька для оплаты криптой. Оплата подтверждается автоматически.'
            : 'После отправки заявки менеджер свяжется с вами, уточнит детали и пришлёт реквизиты для оплаты.'}
        </p>
      </div>
    </div>
  )
}
