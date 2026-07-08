import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Client Supabase avec la clé service_role pour contourner RLS
// À utiliser UNIQUEMENT côté serveur (Server Actions, Route Handlers)
// JAMAIS exposer au client
export function createServiceRoleClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

export function createClient() {
  return createServiceRoleClient()
}
