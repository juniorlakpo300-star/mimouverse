import { Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { supabase, ADMIN_EMAIL } from '../supabase.js'

export default function AdminGuard({ children }) {
  const location = useLocation()
  const [state, setState] = useState('checking')

  useEffect(() => {
    let active = true

    const check = async () => {
      if (!supabase) {
        if (active) setState('missing-config')
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email || user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        if (active) setState('denied')
        return
      }

      const { data: role, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle()

      if (active) setState(!error && role?.role === 'admin' ? 'allowed' : 'denied')
    }

    check()
    return () => { active = false }
  }, [location.pathname])

  if (state === 'checking') {
    return <main className="admin-gate"><div className="admin-gate-card"><ShieldCheck size={34} /><h1>Vérification...</h1><p>Protection de l’espace administrateur.</p></div></main>
  }

  if (state === 'missing-config') {
    return <main className="admin-gate"><div className="admin-gate-card"><ShieldCheck size={34} /><h1>Supabase n’est pas configuré</h1><p>Ajoute VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans les variables d’environnement du projet.</p></div></main>
  }

  if (state !== 'allowed') return <Navigate to="/admin" replace state={{ adminDenied: true }} />

  return children
}
