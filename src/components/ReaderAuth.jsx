import { useEffect, useState } from 'react'
import { Loader2, LogOut, UserPlus, UserRound } from 'lucide-react'
import { supabase } from '../supabase.js'

export default function ReaderAuth({ onAuthChange }) {
  const [user, setUser] = useState(null)
  const [pseudo, setPseudo] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) return undefined

    supabase.auth.getUser().then(({ data }) => {
      const nextUser = data?.user || null
      setUser(nextUser)
      onAuthChange?.(nextUser)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user || null
      setUser(nextUser)
      onAuthChange?.(nextUser)
    })

    return () => listener?.subscription?.unsubscribe()
  }, [onAuthChange])

  const createReader = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    const cleanPseudo = pseudo.trim()
    if (!supabase) {
      setError('Supabase n’est pas configuré.')
      return
    }
    if (!cleanPseudo) {
      setError('Choisis un pseudo.')
      return
    }
    if (cleanPseudo.length < 2) {
      setError('Ton pseudo doit contenir au moins 2 caractères.')
      return
    }

    setLoading(true)
    try {
      const { data, error: authError } = await supabase.auth.signInAnonymously({
        options: { data: { pseudo: cleanPseudo } },
      })
      if (authError) throw authError

      setUser(data?.user || null)
      setMessage(`Bienvenue ${cleanPseudo} ! Tu restes connecté sur cet appareil.`)
      setPseudo('')
    } catch (authError) {
      setError(authError?.message || 'Impossible de créer ton identité de lecteur.')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
    setMessage('Tu es déconnecté.')
    setError('')
  }

  if (user) {
    const displayPseudo = user.user_metadata?.pseudo || user.user_metadata?.username || 'Lecteur MIMOUVERSE'
    return (
      <div className="reader-auth-connected">
        <div className="reader-auth-identity">
          <span className="reader-auth-avatar"><UserRound size={18} /></span>
          <div>
            <strong>{displayPseudo}</strong>
            <span>Connecté pour commenter</span>
          </div>
        </div>
        <button type="button" className="reader-auth-logout" onClick={logout}>
          <LogOut size={16} /> Déconnexion
        </button>
        {message && <p className="feedback-success">{message}</p>}
      </div>
    )
  }

  return (
    <div className="reader-auth-card">
      <div className="reader-auth-tabs">
        <div className="reader-auth-tab active"><UserPlus size={16} /> Créer mon pseudo</div>
      </div>

      <form onSubmit={createReader} className="reader-auth-form">
        <label>
          <span>Pseudo public</span>
          <input
            value={pseudo}
            onChange={(event) => setPseudo(event.target.value)}
            placeholder="Ex. Koffi_225"
            maxLength={30}
            autoComplete="nickname"
          />
        </label>
        <button className="feedback-submit reader-auth-submit" type="submit" disabled={loading}>
          {loading ? <><Loader2 size={16} className="feedback-spin" /> Connexion...</> : <><UserPlus size={16} /> Continuer</>}
        </button>
      </form>
      <p className="reader-auth-help">Ton pseudo est visible par les autres lecteurs. Aucun e-mail ni mot de passe n’est demandé.</p>
      {message && <p className="feedback-success">{message}</p>}
      {error && <p className="feedback-error">{error}</p>}
    </div>
  )
}
