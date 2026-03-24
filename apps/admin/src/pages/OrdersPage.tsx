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
  user: {
    telegramId: string
    firstName: string
    username?: string
  }
}

export default function OrdersPage({ apiKey, onSelectUser, onUnauthorized }: { apiKey: string; onSelectUser: (id: string) => void; onUnauthorized: () => void }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const headers = { 'x-admin-key': apiKey }

  useEffect(() => {
    fetch(`${API}/admin/orders/all`, { headers })
      .then(r => { if (r.status === 401) { onUnauthorized(); return null } return r.json() })
      .then(data => { if (data) setOrders(data) })
      .finally(() => setLoading(false))
  }, [])

  const changeStatus = async (orderId: number, status: string) => {
    const res = await fetch(`${API}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ status }),
    })
    if (res.status === 401) { onUnauthorized(); return }
    if (!res.ok) return
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
  }

  const counts = {
    total: orders.length,
    new: orders.filter(o => o.status === 'NEW').length,
    active: orders.filter(o => ['PROCESSING', 'AWAITING_PAYMENT'].includes(o.status)).length,
    done: orders.filter(o => o.status === 'COMPLETED').length,
  }

  if (loading) return <div className="loading">Загрузка...</div>

  return (
    <>
      <h1>Subpay Service Admin</h1>

      <div className="stat-row">
        <div className="stat"><div className="stat-value">{counts.total}</div><div className="stat-label">Всего заявок</div></div>
        <div className="stat"><div className="stat-value">{counts.new}</div><div className="stat-label">Новых</div></div>
        <div className="stat"><div className="stat-value">{counts.active}</div><div className="stat-label">В работе</div></div>
        <div className="stat"><div className="stat-value">{counts.done}</div><div className="stat-label">Выполнено</div></div>
      </div>

      <div className="card">
        <h2>Все заявки</h2>
        <table className="orders-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Клиент</th>
              <th>Сервис</th>
              <th>Период</th>
              <th>Сумма</th>
              <th>Комментарий</th>
              <th>Статус</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} onClick={() => onSelectUser(order.user.telegramId)}>
                <td>#{order.id}</td>
                <td>
                  <div className="user-name">{order.user.firstName}</div>
                  <div className="user-meta">
                    {order.user.username ? `@${order.user.username} · ` : ''}
                    {order.user.telegramId}
                  </div>
                </td>
                <td>{order.service?.name ?? `#${order.id}`}</td>
                <td>{order.duration}</td>
                <td>${order.totalPrice}</td>
                <td style={{ color: order.notes ? '#FFE000' : '#444', fontSize: '13px', maxWidth: '180px' }}>
                  {order.notes ?? '—'}
                </td>
                <td onClick={e => e.stopPropagation()}>
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
                <td>{new Date(order.createdAt).toLocaleDateString('ru-RU', { timeZone: 'UTC' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
