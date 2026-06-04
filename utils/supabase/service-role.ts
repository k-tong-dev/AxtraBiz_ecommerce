import { createClient } from '@supabase/supabase-js'
import { supabaseUrl, supabaseServiceRoleKey, requireEnv } from './config'

export const createServiceRoleClient = () => {
  return createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL', supabaseUrl),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY', supabaseServiceRoleKey),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}
