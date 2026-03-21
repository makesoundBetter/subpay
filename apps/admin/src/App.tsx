import { useState } from 'react'
import './index.css'
import OrdersPage from './pages/OrdersPage'
import UserPage from './pages/UserPage'

export type View =
  | { type: 'orders' }
  | { type: 'user'; telegramId: string }

export default function App() {
  const [view, setView] = useState<View>({ type: 'orders' })

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
