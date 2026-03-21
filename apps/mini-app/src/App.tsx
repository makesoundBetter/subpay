import { useState } from 'react'
import { AppRoot } from '@telegram-apps/telegram-ui'
import CatalogPage from './pages/CatalogPage'
import OrderPage from './pages/OrderPage'
import MyOrdersPage from './pages/MyOrdersPage'
import WelcomePage from './pages/WelcomePage'
import './App.css'

export type Page = 'catalog' | 'orders'

export type SelectedService = {
  id: number
  name: string
  category: string
  icon: string
  prices: { duration: string; total: number }[]
}

function App() {
  const [welcomed, setWelcomed] = useState(false)
  const [page, setPage] = useState<Page>('catalog')
  const [selectedService, setSelectedService] = useState<SelectedService | null>(null)

  return (
    <AppRoot>
      <div className="app">
        {!welcomed && <WelcomePage onDone={() => setWelcomed(true)} />}
        {selectedService ? (
          <OrderPage
            service={selectedService}
            onBack={() => setSelectedService(null)}
          />
        ) : page === 'catalog' ? (
          <CatalogPage
            onSelectService={setSelectedService}
            onGoToOrders={() => setPage('orders')}
          />
        ) : (
          <MyOrdersPage onBack={() => setPage('catalog')} />
        )}
      </div>
    </AppRoot>
  )
}

export default App
