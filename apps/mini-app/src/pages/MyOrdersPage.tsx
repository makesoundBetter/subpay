import { useEffect, useState } from 'react'

type Order = {
  id: number
  serviceId: number
  service?: { name: string }
  duration: string
  totalPrice: number
  status: string
  createdAt: string
}

const STATUS_LABELS: Record<string, string> = {
  NEW: '🆕 Новая',
  PROCESSING: '⚙️ В работе',
  AWAITING_PAYMENT: '💳 Ожидает оплаты',
  PAID: '✅ Оплачено',
  COMPLETED: '🎉 Выполнено',
  CANCELLED: '❌ Отменена',
}

type Props = {
  onBack: () => void
}

export default function MyOrdersPage({ onBack }: Props) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp
    const telegramId = tg?.initDataUnsafe?.user?.id ?? 'test_user'

    fetch(`${import.meta.env.VITE_API_URL}/orders/${telegramId}`)
      .then(r => r.json())
      .then(data => setOrders(data))
      .catch(() => setError('Не удалось загрузить заявки'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <div className="back-header">
        <button className="back-btn" onClick={onBack}>← Назад</button>
      </div>
      <h2>Мои заявки</h2>

      {loading && <p className="loading-text">Загрузка...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>У вас пока нет заявок</p>
        </div>
      )}

      {orders.map(order => (
        <div key={order.id} className="order-card">
          <div className="order-card-row">
            <span className="order-id">Заявка #{order.id}</span>
            <span className="order-status">{STATUS_LABELS[order.status] ?? order.status}</span>
          </div>
          <div className="order-card-row">
            <span className="order-duration">{order.service?.name ?? `Сервис #${order.serviceId}`} · {order.duration}</span>
            <span className="order-price">${order.totalPrice}</span>
          </div>
          <div className="order-date">
            {new Date(order.createdAt).toLocaleDateString('ru-RU')}
          </div>
        </div>
      ))}
    </div>
  )
}
