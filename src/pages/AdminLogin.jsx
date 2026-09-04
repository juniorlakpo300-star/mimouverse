import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Chrome, ShieldCheck } from 'lucide-react'
import { supabase, ADMIN_EMAIL } from '../supabase.js'

export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true
    const checkSession = async () => {
      if (!supabase) { if (active) setLoading(false); return }
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) navigate('/admin/secure', { replace: true })
      else if (active) setLoading(false)
    }
    checkSession()
    return () => { active = false }
  }, [navigate])

  const loginWithGoogle = async () => {
    if (!supabase) { setMessage('Supabase n’est pas configuré.'); return }
    setBusy(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/admin/secure` },
    })
    if (error) { setBusy(false); setMessage(error.message) }
  }

  if (loading) return <main className="admin-gate"><div className="admin-gate-card"><ShieldCheck size={34} /><h1>Vérification...</h1><p>Ouverture de l’espace sécurisé.</p></div></main>

  return (
    <main className="admin-gate">
      <section className="admin-login-card">
        <div className="admin-login-icon"><ShieldCheck size={30} /></div>
        <span className="kicker">MIMOUVERSE · SÉCURITÉ</span>
        <h1>Accès administrateur</h1>
        <p>Connecte uniquement le compte Google propriétaire autorisé à gérer MIMOUVERSE.</p>
        <button className="admin-google-button" onClick={loginWithGoogle} disabled={busy}>
          <Chrome size={19} /> {busy ? 'Redirection...' : 'Continuer avec Google'}
        </button>
        {message && <div className="admin-login-error">{message}</div>}
        {location.state?.adminDenied && <div className="admin-login-error">Ce compte n’a pas les droits administrateur.</div>}
        <small>Compte autorisé : {ADMIN_EMAIL}</small>
      </section>
    </main>
  )
}
