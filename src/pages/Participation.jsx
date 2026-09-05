import { useState } from 'react'

export default function Participation() {
  const [pseudo, setPseudo] = useState('')
  const [saved, setSaved] = useState(false)

  const savePseudo = (event) => {
    event.preventDefault()

    const value = pseudo.trim()

    if (!value) return

    localStorage.setItem('mimou_pseudo', value)
    setPseudo(value)
    setSaved(true)
  }

  return (
    <main className="simple-page">
      <span className="page-badge">💬 PARTICIPATION</span>

      <h1>Participe à MIMOUVERSE</h1>

      <p>
        Aucun compte nécessaire. Choisis simplement un pseudo pour
        participer à la communauté.
      </p>

      <section className="participation-box">
        <div className="participation-icon">👤</div>

        <h2>Ton pseudo</h2>

        <p>
          Ton pseudo sera utilisé lorsque tu voudras commenter ou noter
          une œuvre.
        </p>

        <form onSubmit={savePseudo}>
          <input
            value={pseudo}
            onChange={(event) => {
              setPseudo(event.target.value)
              setSaved(false)
            }}
            maxLength={30}
            placeholder="Exemple : Junior_23"
          />

          <button type="submit">
            Enregistrer
          </button>
        </form>

        {saved && (
          <div className="success-message">
            ✓ Pseudo enregistré sur cet appareil.
          </div>
        )}
      </section>
    </main>
  )
}
