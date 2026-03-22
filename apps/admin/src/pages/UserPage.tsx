import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const STATUS_LABELS: Record<string, string> = {
  NEW: '🆕 Новая',
  PROCESSING: '⚙️ В работе',
  AWAITING_PAYMENT: '💳 Ожидает оплаты',
  PAID: '✅ Оплачено',
  COMPLETED: '🎉 Выполнено',
  CANCELLED: '❌ Отменена',
}

type Order = {
  id: number
  status: string
  duration: string
  totalPrice: number
  createdAt: string
  notes?: string
  service?: { name: string }
}

type User = {
  telegramId: string
  firstName: string
  username?: string
  createdAt: string
  orders: Order[]
}

export default function UserPage({ telegramId, onBack }: { telegramId: string; onBack: () => void }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/admin/users/${telegramId}`)
      .then(r => r.json())
      .then(setUser)
      .finally(() => setLoading(false))
  }, [telegramId])

  const changeStatus = async (orderId: number, status: string) => {
    await fetch(`${API}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setUser(prev => prev ? {
      ...prev,
      orders: prev.orders.map(o => o.id === orderId ? { ...o, status } : o)
    } : prev)
  }

  if (loading) return <div className="loading">Загрузка...</div>
  if (!user) return <div className="error-msg">Пользователь не найден</div>

  const total = user.orders.reduce((sum, o) => sum + o.totalPrice, 0)
  const ordersWithComments = user.orders.filter(o => o.notes)

  return (
    <>
      <button className="back-btn" onClick={onBack}>← Назад к заявкам</button>

      <div className="card">
        <h2>Профиль клиента</h2>
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          <div className="user-profile-field">
            <label>Имя</label>
            <span>{user.firstName}</span>
          </div>
          {user.username && (
            <div className="user-profile-field">
              <label>Username</label>
              <span>@{user.username}</span>
            </div>
          )}
          <div className="user-profile-field">
            <label>Telegram ID</label>
            <span>{user.telegramId}</span>
          </div>
          <div className="user-profile-field">
            <label>Клиент с</label>
            <span>{new Date(user.createdAt).toLocaleDateString('ru-RU')}</span>
          </div>
          <div className="user-profile-field">
            <label>Всего заказов</label>
            <span>{user.orders.length}</span>
          </div>
          <div className="user-profile-field">
            <label>Сумма заказов</label>
            <span>${total}</span>
          </div>
        </div>
      </div>

      {ordersWithComments.length > 0 && (
        <div className="card">
          <h2>💬 Комментарии клиента</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ordersWithComments.map(o => (
              <div key={o.id} style={{ background: '#1a1a1a', borderRadius: '8px', padding: '12px 14px', borderLeft: '3px solid #FFE000' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                  #{o.id} · {o.service?.name ?? '—'} · {new Date(o.createdAt).toLocaleDateString('ru-RU')}
                </div>
                <div style={{ color: '#f0f0f0', fontSize: '14px' }}>{o.notes}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2>История заявок</h2>
        <table className="orders-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Сервис</th>
              <th>Период</th>
              <th>Сумма</th>
              <th>Комментарий</th>
              <th>Статус</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {user.orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.service?.name ?? '—'}</td>
                <td>{order.duration}</td>
                <td>${order.totalPrice}</td>
                <td style={{ color: order.notes ? '#FFE000' : '#333', maxWidth: '200px', fontSize: '13px' }}>
                  {order.notes ?? '—'}
                </td>
                <td>
                  <select
                    className="select-status"
                    value={order.status}
                    onChange={e => changeStatus(order.id, e.target.value)}
                  >
                    {Object.entries(STATUS_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
