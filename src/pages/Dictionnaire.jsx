import { useState } from 'react'

export default function Dictionnaire() {
  const [word, setWord] = useState('')

  return (
    <main className="simple-page">
      <span className="page-badge">📖 DICTIONNAIRE</span>

      <h1>Dictionnaire MIMOUVERSE</h1>

      <p>
        Recherche un mot et découvre sa définition.
      </p>

      <div className="dictionary-search">
        <input
          type="text"
          value={word}
          onChange={(event) => setWord(event.target.value)}
          placeholder="Rechercher un mot..."
        />

        <button type="button">
          🔎 Rechercher
        </button>
      </div>

      {word && (
        <section className="empty-section">
          <div>📖</div>
          <h2>Recherche : {word}</h2>
          <p>
            Le dictionnaire sera connecté à sa base de données prochainement.
          </p>
        </section>
      )}
    </main>
  )
}
