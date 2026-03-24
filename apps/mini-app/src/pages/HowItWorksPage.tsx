type Props = {
  onBack: () => void
}

const STEPS = [
  {
    num: '01',
    title: 'Выбери сервис',
    desc: 'Найди нужную подписку в каталоге — ChatGPT, Netflix, Spotify и ещё 90+ сервисов.',
  },
  {
    num: '02',
    title: 'Оплати сервис',
    desc: 'Выбери нужный период и нажми "Оплатить".',
  },
  {
    num: '03',
    title: 'Ожидай информацию в Telegram боте',
    desc: 'Статус заявки придёт в бот. Также можно проверить его в любой момент во вкладке "Мои заявки".',
  },
]

const FAQ = [
  {
    q: 'Почему не могу оплатить сам?',
    a: 'Большинство зарубежных сервисов не принимают карты СНГ. Мы оплачиваем через зарубежные методы.',
  },
  {
    q: 'Насколько это безопасно?',
    a: 'Мы работаем с реальными аккаунтами и проверенными методами оплаты. 100+ выполненных заявок.',
  },
  {
    q: 'Как быстро активируется подписка?',
    a: 'Обычно 1-2 часа после оплаты. В редких случаях до 24 часов.',
  },
  {
    q: 'Что если что-то пойдёт не так?',
    a: 'Мы всегда на связи в Telegram. Решим любую проблему или вернём деньги.',
  },
]

export default function HowItWorksPage({ onBack }: Props) {
  return (
    <div className="page">
      <div className="how-scroll">
        <h2 className="how-title">Как это работает</h2>

        <div className="how-steps">
          {STEPS.map(step => (
            <div key={step.num} className="how-step">
              <div className="how-step-num">{step.num}</div>
              <div className="how-step-body">
                <div className="how-step-title">{step.title}</div>
                <div className="how-step-desc">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="how-title" style={{ marginTop: 28 }}>Частые вопросы</h2>

        <div className="how-faq">
          {FAQ.map((item, i) => (
            <div key={i} className="how-faq-item">
              <div className="how-faq-q">{item.q}</div>
              <div className="how-faq-a">{item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
