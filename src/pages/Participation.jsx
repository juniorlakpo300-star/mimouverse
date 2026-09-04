import { useState } from 'react'
import { MessageCircle, Star, UserRound } from 'lucide-react'

export default function Participation() {
  const [pseudo, setPseudo] = useState(() => localStorage.getItem('mimou_pseudo') || '')
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
    <main className="participation-page">
      <section className="participation-card">
        <div className="participation-icon"><UserRound size={26} /></div>
        <span className="kicker">Participation lecteur</span>
        <h1>Choisis ton pseudo</h1>
        <p>Pas besoin de créer un compte. Ton pseudo sert uniquement lorsque tu veux donner ton avis ou noter une œuvre.</p>
        <form onSubmit={savePseudo}>
          <label>Ton pseudo</label>
          <input value={pseudo} onChange={(e) => { setPseudo(e.target.value); setSaved(false) }} maxLength={30} placeholder="Ex. Junior_23" />
          <button className="button primary" type="submit">Enregistrer mon pseudo</button>
        </form>
        {saved && <div className="participation-success">✓ Pseudo enregistré sur cet appareil.</div>}
        <div className="participation-features">
          <span><MessageCircle size={17} /> Commenter</span>
          <span><Star size={17} /> Noter de 1 à 5</span>
        </div>
      </section>
    </main>
  )
}
