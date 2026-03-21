import { useEffect, useState } from 'react'
import './WelcomePage.css'

export default function WelcomePage({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100)
    const t2 = setTimeout(() => setFadeOut(true), 2600)
    const t3 = setTimeout(() => onDone(), 3100)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  return (
    <div className={`welcome-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className={`welcome-content ${visible ? 'visible' : ''}`}>
        <div className="welcome-text">Добро пожаловать в<br /><span className="welcome-brand">Subpay Service</span>!</div>
      </div>
    </div>
  )
}
