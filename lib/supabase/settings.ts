import type { Setting } from '@/lib/types'
import { getSupabaseClient } from './client'

function toStringOrUndefined(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined
  return String(value)
}

function mapSettingRow(row: Record<string, unknown>): Setting | null {
  const id = toStringOrUndefined(row.id) ?? toStringOrUndefined(row.uuid)
  const key = toStringOrUndefined(row.key) ?? toStringOrUndefined(row.setting_key) ?? toStringOrUndefined(row.name)
  const value = toStringOrUndefined(row.value) ?? toStringOrUndefined(row.setting_value) ?? toStringOrUndefined(row.val)
  const updatedAt = toStringOrUndefined(row.updatedAt) ?? toStringOrUndefined(row.updated_at) ?? new Date().toISOString()

  if (!id || !key || value === undefined) return null

  return { id, key, value, updatedAt }
}

export async function fetchSettingsFromSupabase(): Promise<Setting[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  try {
    const { data, error } = await supabase.from('settings').select('*')
    if (error || !data) return []

    const mapped = (data as Record<string, unknown>[])
      .map((row) => mapSettingRow(row))
      .filter(Boolean) as Setting[]

    return mapped
  } catch {
    return []
  }
}

export async function upsertSettingInSupabase(setting: Partial<Setting> & { id: string }): Promise<boolean> {
  const supabase = getSupabaseClient()
  if (!supabase) return false

  try {
    await supabase.from('settings').upsert(setting as any, { onConflict: 'id' })
    return true
  } catch {
    return false
  }
}

export async function deleteSettingFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  if (!supabase) return false

  try {
    const { error } = await supabase.from('settings').delete().eq('id', id)
    return !error
  } catch {
    return false
  }
}

