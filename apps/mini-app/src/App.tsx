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
  const [welcomed, setWelcomed] = useState(() => sessionStorage.getItem('welcomed') === '1')

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

  const handleWelcomeDone = () => {
    sessionStorage.setItem('welcomed', '1')
    setWelcomed(true)
  }

  const goBack = () => {
    if (cryptoPayment) {
      setCryptoPayment(null)
      setPage('catalog')
    } else if (selectedService) {
      setSelectedService(null)
    } else if (page !== 'catalog') {
      setPage('catalog')
    }
  }

  // Telegram BackButton: show on sub-pages, handle back navigation
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp
    if (!tg?.BackButton) return

    const isSubPage = !!cryptoPayment || !!selectedService || page !== 'catalog'

    if (isSubPage) {
      tg.BackButton.show()
      tg.BackButton.onClick(goBack)
      return () => tg.BackButton.offClick(goBack)
    } else {
      tg.BackButton.hide()
    }
  }, [selectedService, page, cryptoPayment])

  return (
    <AppRoot>
      <div className="app">
        {!welcomed && <WelcomePage onDone={handleWelcomeDone} />}

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
