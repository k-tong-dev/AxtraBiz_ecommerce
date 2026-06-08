import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseUrl, supabaseAnonKey, requireEnv } from './supabase-config'

export const createClient = async () => {
  const cookieStore = await cookies()

  return createServerClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL', supabaseUrl),
    requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', supabaseAnonKey),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // Server Components may not allow setting cookies directly.
          }
        },
      },
    },
  )
}
