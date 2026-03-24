import { useEffect, useRef, useState } from 'react'
import type { CryptoPaymentData } from './OrderPage'

type Props = {
  orderId: number
  payment: CryptoPaymentData
  onBack: () => void
  onPaid: () => void
}

export default function CryptoPaymentPage({ orderId, payment, onBack, onPaid }: Props) {
  const [status, setStatus] = useState<'waiting' | 'paid' | 'cancelled'>('waiting')
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}/payment`)
        if (!res.ok) return
        const data = await res.json()
        if (data.status === 'PAID' || data.status === 'COMPLETED') {
          clearInterval(pollRef.current!)
          setStatus('paid')
          setTimeout(onPaid, 2000)
        } else if (data.status === 'CANCELLED') {
          clearInterval(pollRef.current!)
          setStatus('cancelled')
        }
      } catch (_e) {}
    }, 5000)
    return () => clearInterval(pollRef.current!)
  }, [orderId])

  const openPayUrl = () => {
    const tg = (window as any).Telegram?.WebApp
    if (tg?.openLink) {
      tg.openLink(payment.payUrl)
    } else {
      window.open(payment.payUrl, '_blank')
    }
  }

  if (status === 'paid') {
    return (
      <div className="page center">
        <div style={{ fontSize: 48 }}>✅</div>
        <h2 style={{ color: '#44cc44' }}>Оплата подтверждена!</h2>
        <p style={{ color: '#ffffff' }}>Ваша заявка #{orderId} оплачена. Менеджер приступит к выполнению.</p>
        <button className="btn-primary" onClick={onBack}>На главную</button>
      </div>
    )
  }

  if (status === 'cancelled') {
    return (
      <div className="page center">
        <h2 style={{ color: '#cc4444' }}>Заявка отменена</h2>
        <p style={{ color: '#ffffff' }}>Оплата не прошла. Создайте новую заявку.</p>
        <button className="btn-primary" onClick={onBack}>На главную</button>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="back-header">
        <button className="back-btn" onClick={onBack}>← Назад</button>
      </div>

      <div className="order-page-scroll">
        <div className="crypto-pay-header">
          <div className="crypto-pay-title">Оплата криптой</div>
          <div className="crypto-pay-subtitle">{payment.serviceName} · ${payment.totalUsd}</div>
        </div>

        <div style={{ textAlign: 'center', margin: '32px 0 24px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>💎</div>
          <p style={{ color: '#ccc', fontSize: 15, lineHeight: 1.5, marginBottom: 8 }}>
            Нажмите кнопку ниже, чтобы открыть страницу оплаты в CryptoBot.
          </p>
          <p style={{ color: '#888', fontSize: 13 }}>
            Поддерживаются: USDT, TON, BTC, ETH, LTC
          </p>
        </div>

        <button className="btn-primary" onClick={openPayUrl} style={{ marginBottom: 16 }}>
          Открыть CryptoBot
        </button>

        <div className="crypto-status-wrap">
          <span className="crypto-status-dot" />
          <span className="crypto-status-text">Ожидаем оплату...</span>
        </div>

        <p className="order-note" style={{ marginTop: 16 }}>
          После оплаты в CryptoBot страница обновится автоматически. Не закрывайте приложение.
        </p>
      </div>
    </div>
  )
}
