import { createClient } from '@/lib/utils/supabase-server'

export async function getCurrentUserId(): Promise<string | undefined> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    return data.user?.id
  } catch {
    return undefined
  }
}

export async function getCurrentShopId(): Promise<number | undefined> {
  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const val = cookieStore.get('active_shop_id')?.value
    if (!val) return undefined
    const n = Number(val)
    return Number.isNaN(n) ? undefined : n
  } catch {
    return undefined
  }
}
