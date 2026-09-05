import { useEffect, useState } from 'react'
import { LogIn, UserPlus, LogOut, Loader2, UserRound } from 'lucide-react'
import { supabase } from '../supabase.js'

export default function ReaderAuth({ onAuthChange }) {
  const [user, setUser] = useState(null)
  const [mode, setMode] = useState('login')
  const [pseudo, setPseudo] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) return undefined

    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null)
      onAuthChange?.(data?.user || null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user || null
      setUser(nextUser)
      onAuthChange?.(nextUser)
    })

    return () => listener?.subscription?.unsubscribe()
  }, [onAuthChange])

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!supabase) {
      setError('Supabase n’est pas configuré.')
      return
    }

    if (mode === 'signup' && !pseudo.trim()) {
      setError('Choisis un pseudo.')
      return
    }

    if (!email.trim() || !password) {
      setError('Renseigne ton e-mail et ton mot de passe.')
      return
    }

    setLoading(true)
    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { pseudo: pseudo.trim() } },
        })
        if (signUpError) throw signUpError

        if (data?.session) {
          setMessage(`Bienvenue ${pseudo.trim()} !`)
        } else {
          setMessage('Compte créé. Vérifie ton e-mail si la confirmation est demandée par Supabase.')
          setMode('login')
        }
      } else {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (loginError) throw loginError
        setUser(data?.user || null)
        setMessage('Connexion réussie.')
      }
      setPassword('')
    } catch (authError) {
      setError(authError?.message || 'Impossible de se connecter pour le moment.')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setMessage('Tu es déconnecté.')
  }

  if (user) {
    const displayPseudo = user.user_metadata?.pseudo || user.user_metadata?.username || 'Lecteur MIMOUVERSE'
    return (
      <div className="reader-auth-connected">
        <div className="reader-auth-identity">
          <span className="reader-auth-avatar"><UserRound size={18} /></span>
          <div><strong>{displayPseudo}</strong><span>Connecté pour commenter</span></div>
        </div>
        <button type="button" className="reader-auth-logout" onClick={logout}><LogOut size={16} /> Déconnexion</button>
        {message && <p className="feedback-success">{message}</p>}
      </div>
    )
  }

  return (
    <div className="reader-auth-card">
      <div className="reader-auth-tabs">
        <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); setMessage('') }}><LogIn size={16} /> Se connecter</button>
        <button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setError(''); setMessage('') }}><UserPlus size={16} /> Créer un compte</button>
      </div>

      <form onSubmit={submit} className="reader-auth-form">
        {mode === 'signup' && <label><span>Pseudo</span><input value={pseudo} onChange={(event) => setPseudo(event.target.value)} placeholder="Ton pseudo public" maxLength={30} autoComplete="nickname" /></label>}
        <label><span>E-mail</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ton@email.com" autoComplete="email" /></label>
        <label><span>Mot de passe</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" minLength={6} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} /></label>
        <button className="feedback-submit reader-auth-submit" type="submit" disabled={loading}>{loading ? <><Loader2 size={16} className="feedback-spin" /> Traitement...</> : mode === 'signup' ? <><UserPlus size={16} /> Créer mon compte</> : <><LogIn size={16} /> Se connecter</>}</button>
      </form>
      <p className="reader-auth-help">Ton pseudo sera le nom visible par les autres lecteurs. Ton e-mail reste lié à ton compte.</p>
      {message && <p className="feedback-success">{message}</p>}
      {error && <p className="feedback-error">{error}</p>}
    </div>
  )
}
