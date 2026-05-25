import { createClient } from './server'

export async function getCurrentUserId(): Promise<string | undefined> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    return data.user?.id
  } catch {
    return undefined
  }
}
