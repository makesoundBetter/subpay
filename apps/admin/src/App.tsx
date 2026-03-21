import { useState } from 'react'
import './index.css'
import OrdersPage from './pages/OrdersPage'
import UserPage from './pages/UserPage'

export type View =
  | { type: 'orders' }
  | { type: 'user'; telegramId: string }

const PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin'

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const submit = () => {
    if (value === PASSWORD) {
      localStorage.setItem('admin_auth', '1')
      onLogin()
    } else {
      setError(true)
      setValue('')
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ width: 320 }}>
        <h2 style={{ marginBottom: 20 }}>Subpay Admin</h2>
        <input
          type="password"
          placeholder="Пароль"
          value={value}
          onChange={e => { setValue(e.target.value); setError(false) }}
          onKeyDown={e => e.key === 'Enter' && submit()}
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 15, marginBottom: 12 }}
          autoFocus
        />
        {error && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 8 }}>Неверный пароль</p>}
        <button
          onClick={submit}
          style={{ width: '100%', padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer' }}
        >
          Войти
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [auth, setAuth] = useState(localStorage.getItem('admin_auth') === '1')
  const [view, setView] = useState<View>({ type: 'orders' })

  if (!auth) return <LoginPage onLogin={() => setAuth(true)} />

  return (
    <div className="layout">
      {view.type === 'orders' && (
        <OrdersPage onSelectUser={(id) => setView({ type: 'user', telegramId: id })} />
      )}
      {view.type === 'user' && (
        <UserPage
          telegramId={view.telegramId}
          onBack={() => setView({ type: 'orders' })}
        />
      )}
    </div>
  )
}
