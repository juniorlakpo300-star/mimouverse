import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LockKeyhole, ShieldCheck, LogIn } from 'lucide-react'
import { supabase, ADMIN_EMAIL } from '../supabase.js'

export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [email, setEmail] = useState(ADMIN_EMAIL)
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true

    const checkSession = async () => {
      if (!supabase) {
        if (active) setLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()

      if (user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        navigate('/admin/secure', { replace: true })
        return
      }

      // Toute session appartenant à un autre compte est immédiatement fermée.
      if (user) await supabase.auth.signOut()

      if (active) setLoading(false)
    }

    checkSession()
    return () => { active = false }
  }, [navigate])

  const login = async (event) => {
    event.preventDefault()

    if (!supabase) {
      setMessage('Supabase n’est pas configuré.')
      return
    }

    const normalizedEmail = email.trim().toLowerCase()

    if (normalizedEmail !== ADMIN_EMAIL.toLowerCase()) {
      setMessage('Accès refusé : ce compte n’est pas autorisé à se connecter à MIMOUVERSE.')
      setPassword('')
      return
    }

    if (!password) {
      setMessage('Entre ton mot de passe.')
      return
    }

    setBusy(true)
    setMessage('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    })

    if (error || data?.user?.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      if (data?.session) await supabase.auth.signOut()
      setBusy(false)
      setPassword('')
      setMessage('Connexion refusée. Vérifie ton adresse et ton mot de passe.')
      return
    }

    navigate('/admin/secure', { replace: true })
  }

  if (loading) {
    return (
      <main className="admin-gate">
        <div className="admin-gate-card">
          <ShieldCheck size={34} />
          <h1>Vérification...</h1>
          <p>Ouverture de l’espace sécurisé.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="admin-gate">
      <section className="admin-login-card">
        <div className="admin-login-icon">
          <LockKeyhole size={30} />
        </div>

        <span className="kicker">MIMOUVERSE · ACCÈS PRIVÉ</span>
        <h1>Connexion propriétaire</h1>
        <p>
          Cet espace est privé. Seul le compte propriétaire de MIMOUVERSE
          est autorisé à se connecter.
        </p>

        <form onSubmit={login}>
          <label>
            Adresse e-mail
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label>
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Ton mot de passe"
              required
            />
          </label>

          <button className="admin-google-button" type="submit" disabled={busy}>
            <LogIn size={19} />
            {busy ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {message && <div className="admin-login-error">{message}</div>}
        {location.state?.adminDenied && (
          <div className="admin-login-error">
            Ce compte n’a pas les droits administrateur.
          </div>
        )}

        <small>Compte autorisé : {ADMIN_EMAIL}</small>
      </section>
    </main>
  )
}
