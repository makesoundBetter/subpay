import { useState } from 'react'
import './index.css'
import OrdersPage from './pages/OrdersPage'
import UserPage from './pages/UserPage'

const API = import.meta.env.VITE_API_URL
if (!API) console.warn('[admin] VITE_API_URL is not set, falling back to localhost:3000')
const API_URL = API || 'http://localhost:3000'

export type View =
  | { type: 'orders' }
  | { type: 'user'; telegramId: string }

function LoginPage({ onLogin }: { onLogin: (key: string) => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!value.trim()) return
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(`${API_URL}/admin/orders/all`, {
        headers: { 'x-admin-key': value.trim() },
      })
      if (res.ok) {
        localStorage.setItem('admin_key', value.trim())
        onLogin(value.trim())
      } else {
        setError(true)
        setValue('')
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ width: 320 }}>
        <h2 style={{ marginBottom: 20 }}>Subpay Service Admin</h2>
        <input
          type="password"
          placeholder="API ключ"
          value={value}
          onChange={e => { setValue(e.target.value); setError(false) }}
          onKeyDown={e => e.key === 'Enter' && submit()}
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 15, marginBottom: 12 }}
          autoFocus
        />
        {error && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 8 }}>Неверный ключ</p>}
        <button
          onClick={submit}
          disabled={loading}
          style={{ width: '100%', padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Проверка...' : 'Войти'}
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('admin_key') || '')
  const [view, setView] = useState<View>({ type: 'orders' })

  const logout = () => {
    localStorage.removeItem('admin_key')
    setApiKey('')
  }

  if (!apiKey) return <LoginPage onLogin={setApiKey} />

  return (
    <div className="layout">
      {view.type === 'orders' && (
        <OrdersPage
          apiKey={apiKey}
          onSelectUser={(id) => setView({ type: 'user', telegramId: id })}
          onUnauthorized={logout}
        />
      )}
      {view.type === 'user' && (
        <UserPage
          apiKey={apiKey}
          telegramId={view.telegramId}
          onBack={() => setView({ type: 'orders' })}
          onUnauthorized={logout}
        />
      )}
    </div>
  )
}
