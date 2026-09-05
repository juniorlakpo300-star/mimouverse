import { useState } from 'react'

export default function Mia() {
  const [message, setMessage] = useState('')

  return (
    <main className="simple-page mia-page">
      <span className="page-badge">🤖 MIA</span>

      <h1>MIA</h1>

      <p>
        Mimou Intelligent Assistant, ton assistant pour découvrir
        et comprendre MIMOUVERSE.
      </p>

      <section className="mia-box">
        <div className="mia-avatar">M</div>

        <div className="mia-welcome">
          <h2>Bonjour 👋</h2>
          <p>
            Je serai bientôt disponible pour répondre à tes questions.
          </p>
        </div>

        <div className="mia-input">
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Écris ton message..."
          />

          <button type="button">
            Envoyer
          </button>
        </div>
      </section>
    </main>
  )
}
