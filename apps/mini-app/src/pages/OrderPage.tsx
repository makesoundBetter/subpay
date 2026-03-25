import { useState } from 'react'
import type { SelectedService } from '../App'
import { API_URL } from '../config'

type Props = {
  service: SelectedService
  onBack: () => void
  onCryptoPayment: (orderId: number, paymentData: CryptoPaymentData) => void
}

export type CryptoPaymentData = {
  invoiceId: number
  payUrl: string
  totalUsd: number
  serviceName: string
}

export default function OrderPage({ service, onBack, onCryptoPayment }: Props) {
  const [selectedPrice, setSelectedPrice] = useState(service.prices[0] ?? null)
  const [comment, setComment] = useState('')
  const paymentMethod = 'CRYPTO'
  const [loading, setLoading] = useState(false)
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

      const res = await fetch(`${API_URL}/orders`, {
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
        }),
      })

      if (!res.ok) throw new Error('Ошибка сервера')

      const data = await res.json()

      if (data.paymentData) {
        onCryptoPayment(data.orderId, {
          invoiceId: data.paymentData.invoiceId,
          payUrl: data.paymentData.payUrl,
          totalUsd: selectedPrice.total,
          serviceName: service.name,
        })
      } else {
        setError('Не удалось создать счёт для оплаты. Попробуйте позже.')
      }
    } catch (e) {
      setError('Не удалось отправить заявку. Попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  if (!selectedPrice) {
    return (
      <div className="page center">
        <p style={{ color: '#888' }}>Нет доступных тарифов для этого сервиса.</p>
        <button className="btn-primary" onClick={onBack}>Назад</button>
      </div>
    )
  }

  return (
    <div className="page">
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
          {loading ? 'Отправляем...' : 'Перейти к оплате'}
        </button>

        <p className="order-note">
          После нажатия откроется страница оплаты CryptoBot. Вы сможете выбрать удобную криптовалюту. Оплата подтверждается автоматически.
        </p>
      </div>
    </div>
  )
}
