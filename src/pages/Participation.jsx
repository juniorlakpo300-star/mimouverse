import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, ShieldCheck, Star, UserRound, Upload } from 'lucide-react'
import { supabase, ADMIN_EMAIL } from '../supabase.js'

export default function Participation() {
  const [pseudo, setPseudo] = useState(() => localStorage.getItem('mimou_pseudo') || '')
  const [saved, setSaved] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let active = true
    const checkAdmin = async () => {
      if (!supabase) return
      const { data } = await supabase.auth.getUser()
      if (active) setIsAdmin(data?.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase())
    }
    checkAdmin()
    return () => { active = false }
  }, [])

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
        {isAdmin && <div style={{marginTop:24,padding:16,border:'1px solid rgba(124,58,237,.3)',borderRadius:16,background:'rgba(124,58,237,.08)'}}><div style={{display:'flex',alignItems:'center',gap:8,color:'#c4b5fd',fontWeight:800,fontSize:13}}><ShieldCheck size={17}/> MODE ADMINISTRATEUR</div><p style={{margin:'8px 0 13px',color:'#94a3b8',fontSize:13}}>Ton compte administrateur peut publier directement des livres et des mangas.</p><Link className="button primary" to="/publier"><Upload size={17}/> Publier une œuvre</Link></div>}
      </section>
    </main>
  )
}
