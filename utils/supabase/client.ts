import { createBrowserClient } from '@supabase/ssr'
import { supabaseUrl, supabaseAnonKey, requireEnv } from './config'

declare global {
  var __agileShopSupabaseClient:
    | ReturnType<typeof createBrowserClient>
    | undefined
}

export const createClient = () => {
  if (!globalThis.__agileShopSupabaseClient) {
    globalThis.__agileShopSupabaseClient = createBrowserClient(
      requireEnv('NEXT_PUBLIC_SUPABASE_URL', supabaseUrl),
      requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', supabaseAnonKey),
    )
  }

  return globalThis.__agileShopSupabaseClient
}
