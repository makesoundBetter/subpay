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

const PAGE_SIZE = 50

export default function OrdersPage({ apiKey, onSelectUser, onUnauthorized }: { apiKey: string; onSelectUser: (id: string) => void; onUnauthorized: () => void }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const headers = { 'x-admin-key': apiKey }

  useEffect(() => {
    setLoading(true)
    fetch(`${API}/admin/orders/all?page=${page}&limit=${PAGE_SIZE}`, { headers })
      .then(r => { if (r.status === 401) { onUnauthorized(); return null } return r.json() })
      .then(data => {
        if (data) {
          setOrders(data.orders)
          setTotalPages(data.pages)
          setTotal(data.total)
        }
      })
      .finally(() => setLoading(false))
  }, [page])

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
    new: orders.filter(o => o.status === 'NEW').length,
    active: orders.filter(o => ['PROCESSING', 'AWAITING_PAYMENT'].includes(o.status)).length,
    done: orders.filter(o => o.status === 'COMPLETED').length,
  }

  if (loading) return <div className="loading">Загрузка...</div>

  return (
    <>
      <h1>Subpay Service Admin</h1>

      <div className="stat-row">
        <div className="stat"><div className="stat-value">{total}</div><div className="stat-label">Всего заявок</div></div>
        <div className="stat"><div className="stat-value">{counts.new}</div><div className="stat-label">Новых</div></div>
        <div className="stat"><div className="stat-value">{counts.active}</div><div className="stat-label">В работе</div></div>
        <div className="stat"><div className="stat-value">{counts.done}</div><div className="stat-label">Выполнено</div></div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>Все заявки</h2>
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="orders-btn">←</button>
              <span style={{ fontSize: 13, color: '#888' }}>{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="orders-btn">→</button>
            </div>
          )}
        </div>
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
