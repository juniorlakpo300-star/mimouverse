import { Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { supabase, ADMIN_EMAIL } from '../supabase.js'

export default function AdminGuard({ children }) {
  const location = useLocation()
  const [state, setState] = useState('checking')

  useEffect(() => {
    let active = true

    const applyUser = (user) => {
      if (!active) return
      if (!user?.email || user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        setState('denied')
        return
      }
      setState('allowed')
    }

    const check = async () => {
      if (!supabase) {
        if (active) setState('missing-config')
        return
      }

      const { data, error } = await supabase.auth.getUser()
      if (error) {
        if (active) setState('denied')
        return
      }

      applyUser(data?.user)
    }

    check()

    if (!supabase) return () => { active = false }

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      applyUser(session?.user)
    })

    return () => {
      active = false
      authListener?.subscription?.unsubscribe()
    }
  }, [location.pathname])

  if (state === 'checking') {
    return <main className="admin-gate"><div className="admin-gate-card"><ShieldCheck size={34} /><h1>Vérification...</h1><p>Protection de l’espace administrateur.</p></div></main>
  }

  if (state === 'missing-config') {
    return <main className="admin-gate"><div className="admin-gate-card"><ShieldCheck size={34} /><h1>Supabase n’est pas configuré</h1><p>Vérifie les variables VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY.</p></div></main>
  }

  if (state !== 'allowed') return <Navigate to="/admin" replace state={{ adminDenied: true }} />

  return children
}
