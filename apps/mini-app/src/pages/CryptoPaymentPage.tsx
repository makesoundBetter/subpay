import { useEffect, useState, useRef } from 'react'
import type { CryptoPaymentData } from './OrderPage'

type Props = {
  orderId: number
  payment: CryptoPaymentData
  onBack: () => void
  onPaid: () => void
}

const TIMER_SECONDS = 30 * 60 // 30 minutes

export default function CryptoPaymentPage({ orderId, payment, onBack, onPaid }: Props) {
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [status, setStatus] = useState<'waiting' | 'paid' | 'expired'>('waiting')
  const intervalRef = useRef<any>(null)
  const pollRef = useRef<any>(null)

  // Countdown timer
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current)
          setStatus('expired')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [])

  // Poll payment status every 5 seconds
  useEffect(() => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}/payment`)
        const data = await res.json()
        if (data.status === 'PAID' || data.status === 'COMPLETED') {
          clearInterval(pollRef.current)
          clearInterval(intervalRef.current)
          setStatus('paid')
          setTimeout(onPaid, 2000)
        } else if (data.status === 'CANCELLED') {
          clearInterval(pollRef.current)
          setStatus('expired')
        }
      } catch (e) {}
    }, 5000)
    return () => clearInterval(pollRef.current)
  }, [orderId])

  const copyAddress = () => {
    navigator.clipboard.writeText(payment.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0')
  const seconds = (timeLeft % 60).toString().padStart(2, '0')

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(payment.address)}&bgcolor=0a0a0a&color=ffffff&qzone=1`

  if (status === 'paid') {
    return (
      <div className="page center">
        <div className="crypto-paid-icon">✅</div>
        <h2 style={{ color: '#44cc44' }}>Оплата подтверждена!</h2>
        <p style={{ color: '#ffffff' }}>Ваша заявка #{orderId} оплачена. Менеджер приступит к выполнению.</p>
        <button className="btn-primary" onClick={onBack}>На главную</button>
      </div>
    )
  }

  if (status === 'expired') {
    return (
      <div className="page center">
        <h2 style={{ color: '#cc4444' }}>Время вышло</h2>
        <p style={{ color: '#ffffff' }}>Время на оплату истекло. Создайте новую заявку.</p>
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
          <div className="crypto-pay-title">Оплата {payment.currency.toUpperCase()}</div>
          <div className="crypto-pay-subtitle">{payment.serviceName} · ${payment.totalUsd}</div>
        </div>

        <div className="crypto-amount-box">
          <div className="crypto-amount-label">Сумма к оплате</div>
          <div className="crypto-amount-value">{payment.amount} <span>{payment.currency.toUpperCase()}</span></div>
          <div className="crypto-amount-usd">≈ ${payment.totalUsd}</div>
        </div>

        <div className="crypto-qr-wrap">
          <img
            src={qrUrl}
            alt="QR код адреса"
            className="crypto-qr"
            width={180}
            height={180}
          />
        </div>

        <div className="crypto-address-wrap">
          <div className="crypto-address-label">Адрес кошелька</div>
          <div className="crypto-address">{payment.address}</div>
          <button className="crypto-copy-btn" onClick={copyAddress}>
            {copied ? '✓ Скопировано' : 'Скопировать адрес'}
          </button>
        </div>

        <div className="crypto-timer-wrap">
          <div className="crypto-timer-label">Осталось времени</div>
          <div className="crypto-timer">{minutes}:{seconds}</div>
        </div>

        <div className="crypto-status-wrap">
          <span className="crypto-status-dot" />
          <span className="crypto-status-text">Ожидаем оплату...</span>
        </div>

        <p className="order-note" style={{ marginTop: 16 }}>
          Отправьте точную сумму на указанный адрес. Оплата подтверждается автоматически после 1-3 подтверждений в сети.
        </p>
      </div>
    </div>
  )
}
