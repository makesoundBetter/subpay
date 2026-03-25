import { useEffect, useState } from 'react'
import { MANAGER_URL, API_URL } from '../config'

type Order = {
  id: number
  serviceId: number
  service?: { name: string }
  duration: string
  totalPrice: number
  status: string
  createdAt: string
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; border: string; dot: string }> = {
  NEW:              { label: 'Новая',           bg: '#0a2535', border: '#00bfff', dot: '#00bfff' },
  PROCESSING:       { label: 'В работе',        bg: '#0a1535', border: '#2255cc', dot: '#2255cc' },
  AWAITING_PAYMENT: { label: 'Ожидает оплаты',  bg: '#2a2200', border: '#FFE000', dot: '#FFE000' },
  PAID:             { label: 'Оплачено',         bg: '#2a1500', border: '#ff8800', dot: '#ff8800' },
  COMPLETED:        { label: 'Выполнено',        bg: '#0a2a0a', border: '#44cc44', dot: '#44cc44' },
  CANCELLED:        { label: 'Отменена',         bg: '#2a0a0a', border: '#cc4444', dot: '#cc4444' },
}

type Props = {
  onBack: () => void
}

export default function MyOrdersPage(_props: Props) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp
    const telegramId = tg?.initDataUnsafe?.user?.id

    if (!telegramId) {
      setError('Откройте приложение через Telegram')
      setLoading(false)
      return
    }

    fetch(`${API_URL}/orders/${telegramId}`)
      .then(r => { if (!r.ok) throw new Error(String(r.status)); return r.json() })
      .then(data => setOrders(data))
      .catch(() => setError('Не удалось загрузить заявки'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <div className="back-header" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <a href={MANAGER_URL} target="_blank" rel="noopener noreferrer" className="manager-link">
          Менеджер
        </a>
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

      <div className="orders-list">
        {orders.map(order => {
          const s = STATUS_CONFIG[order.status] ?? { label: order.status, bg: '#111', border: '#333', dot: '#666' }
          return (
            <div key={order.id} className="order-card">
              <div className="order-card-row">
                <span className="order-id">Заявка #{order.id}</span>
                <span className="order-status-badge" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                  <span className="order-status-dot" style={{ background: s.dot, boxShadow: `0 0 6px ${s.dot}` }} />
                  {s.label}
                </span>
              </div>
              <div className="order-card-row">
                <span className="order-duration">{order.service?.name ?? `Сервис #${order.serviceId}`} · {order.duration}</span>
                <span className="order-price">${order.totalPrice}</span>
              </div>
              <div className="order-date">
                {new Date(order.createdAt).toLocaleDateString('ru-RU', { timeZone: 'UTC' })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
