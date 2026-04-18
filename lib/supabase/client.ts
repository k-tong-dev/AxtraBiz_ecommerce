import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

export function getSupabaseClient(): SupabaseClient | null {
  try {
    return createClient()
  } catch {
    return null
  }
}

