import { useState, useEffect } from 'react'
import { AppRoot } from '@telegram-apps/telegram-ui'
import CatalogPage from './pages/CatalogPage'
import OrderPage from './pages/OrderPage'
import type { CryptoPaymentData } from './pages/OrderPage'
import MyOrdersPage from './pages/MyOrdersPage'
import WelcomePage from './pages/WelcomePage'
import HowItWorksPage from './pages/HowItWorksPage'
import CryptoPaymentPage from './pages/CryptoPaymentPage'
import './App.css'

export type Page = 'catalog' | 'orders' | 'how'

export type SelectedService = {
  id: number
  name: string
  category: string
  icon: string
  prices: { duration: string; total: number }[]
}

function App() {
  const [welcomed, setWelcomed] = useState(false)

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp
    if (tg) {
      tg.disableVerticalSwipes?.()
      tg.expand()
    }
  }, [])

  const [page, setPage] = useState<Page>('catalog')
  const [selectedService, setSelectedService] = useState<SelectedService | null>(null)
  const [cryptoPayment, setCryptoPayment] = useState<{ orderId: number; data: CryptoPaymentData } | null>(null)

  const handleCryptoPayment = (orderId: number, data: CryptoPaymentData) => {
    setSelectedService(null)
    setCryptoPayment({ orderId, data })
  }

  const handlePaid = () => {
    setCryptoPayment(null)
    setPage('orders')
  }

  return (
    <AppRoot>
      <div className="app">
        {!welcomed && <WelcomePage onDone={() => setWelcomed(true)} />}

        {cryptoPayment ? (
          <CryptoPaymentPage
            orderId={cryptoPayment.orderId}
            payment={cryptoPayment.data}
            onBack={() => { setCryptoPayment(null); setPage('catalog') }}
            onPaid={handlePaid}
          />
        ) : selectedService ? (
          <OrderPage
            service={selectedService}
            onBack={() => setSelectedService(null)}
            onCryptoPayment={handleCryptoPayment}
          />
        ) : page === 'catalog' ? (
          <CatalogPage
            onSelectService={setSelectedService}
            onGoToOrders={() => setPage('orders')}
            onHowItWorks={() => setPage('how')}
          />
        ) : page === 'how' ? (
          <HowItWorksPage onBack={() => setPage('catalog')} />
        ) : (
          <MyOrdersPage onBack={() => setPage('catalog')} />
        )}
      </div>
    </AppRoot>
  )
}

export default App
