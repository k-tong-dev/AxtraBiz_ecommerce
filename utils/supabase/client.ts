import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

declare global {
  var __agileShopSupabaseClient:
    | ReturnType<typeof createBrowserClient>
    | undefined
}

export const createClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase client environment variables')
  }

  if (!globalThis.__agileShopSupabaseClient) {
    globalThis.__agileShopSupabaseClient = createBrowserClient(supabaseUrl, supabaseKey)
  }

  return globalThis.__agileShopSupabaseClient
}
