import type { User } from '@/lib/types'
import { getSupabaseClient } from './client'

function toStringOrUndefined(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined
  return String(value)
}

function mapCustomerRow(row: Record<string, unknown>): User | null {
  const id = toStringOrUndefined(row.id) ?? toStringOrUndefined(row.user_id) ?? toStringOrUndefined(row.uuid)
  const email = toStringOrUndefined(row.email)
  const name = toStringOrUndefined(row.name) ?? toStringOrUndefined(row.full_name)
  const createdAt =
    toStringOrUndefined(row.createdAt) ?? toStringOrUndefined(row.created_at) ?? new Date().toISOString()
  const roleRaw = toStringOrUndefined(row.role) ?? toStringOrUndefined(row.user_role)
  const role = roleRaw === 'admin' ? 'admin' : 'customer'

  if (!id || !email || !name) return null

  return { id, email, name, role, createdAt }
}

export async function fetchCustomersFromSupabase(): Promise<User[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  try {
    const { data, error } = await supabase.from('users').select('*')
    if (error || !data) return []

    const mapped = (data as Record<string, unknown>[])
      .map((row) => mapCustomerRow(row))
      .filter(Boolean) as User[]

    return mapped
  } catch {
    return []
  }
}

export async function upsertCustomerInSupabase(customer: Partial<User> & { id: string }): Promise<boolean> {
  const supabase = getSupabaseClient()
  if (!supabase) return false

  try {
    await supabase.from('users').upsert(customer as any, { onConflict: 'id' })
    return true
  } catch {
    return false
  }
}

export async function deleteCustomerFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  if (!supabase) return false

  try {
    const { error } = await supabase.from('users').delete().eq('id', id)
    return !error
  } catch {
    return false
  }
}

