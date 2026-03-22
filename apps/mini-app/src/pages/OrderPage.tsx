import { useState } from 'react'
import type { SelectedService } from '../App'

type Props = {
  service: SelectedService
  onBack: () => void
}

export default function OrderPage({ service, onBack }: Props) {
  const [selectedPrice, setSelectedPrice] = useState(service.prices[0])
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const tg = (window as any).Telegram?.WebApp
      const user = tg?.initDataUnsafe?.user

      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId: user?.id ?? 'test_user',
          firstName: user?.first_name ?? 'Тест',
          username: user?.username ?? null,
          serviceId: service.id,
          serviceName: service.name,
          duration: selectedPrice.duration,
          totalPrice: selectedPrice.total,
          comment: comment.trim() || null,
        }),
      })

      if (!res.ok) throw new Error('Ошибка сервера')
      setSubmitted(true)
    } catch (e) {
      setError('Не удалось отправить заявку. Попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="page center">
        <div className="success-icon">✅</div>
        <h2>Заявка отправлена!</h2>
        <p>Менеджер обработает заявку и свяжется с вами для оплаты.</p>
        <a
          className="btn-manager"
          href="https://t.me/Torontocake"
          target="_blank"
          rel="noopener noreferrer"
        >
          💬 Написать менеджеру
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
          {loading ? 'Отправляем...' : 'Отправить заявку'}
        </button>

        <p className="order-note">
          После отправки заявки менеджер свяжется с вами, уточнит детали и пришлёт реквизиты для оплаты.
        </p>
      </div>
    </div>
  )
}
