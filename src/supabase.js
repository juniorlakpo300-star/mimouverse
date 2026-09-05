import { createClient } from '@supabase/supabase-js'

function cleanEnvValue(value) {
  const cleaned = String(value || '').trim()
  if (
    cleaned.length >= 2 &&
    ((cleaned.startsWith('"') && cleaned.endsWith('"')) ||
      (cleaned.startsWith("'") && cleaned.endsWith("'")))
  ) {
    return cleaned.slice(1, -1).trim()
  }
  return cleaned
}

const supabaseUrl = cleanEnvValue(import.meta.env.VITE_SUPABASE_URL).replace(/\/$/, '')
const publishableKey = cleanEnvValue(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
const anonKey = cleanEnvValue(import.meta.env.VITE_SUPABASE_ANON_KEY)
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
