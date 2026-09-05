import { createClient } from '@supabase/supabase-js'

const supabaseUrl = String(import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/$/, '')
const publishableKey = String(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim()
const anonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()
const supabaseKey = publishableKey || anonKey

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

// Diagnostic non-secret : on ne journalise jamais la clé Supabase.
if (import.meta.env.DEV) {
  console.info('[MIMOUVERSE] Supabase config', {
    urlConfigured: Boolean(supabaseUrl),
    keyConfigured: Boolean(supabaseKey),
    keySource: publishableKey ? 'publishable' : anonKey ? 'anon' : 'none',
  })
}

export const ADMIN_EMAIL = 'juniorlakpo300@gmail.com'
