import type { Announcement } from '@/lib/types'
import { getSupabaseClient } from './client'

function toStringOrUndefined(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined
  return String(value)
}

function toBooleanOrUndefined(value: unknown): boolean | undefined {
  if (value === null || value === undefined) return undefined
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') return value.toLowerCase() === 'true' || value === '1'
  return undefined
}

function mapAnnouncementRow(row: Record<string, unknown>): Announcement | null {
  const id = toStringOrUndefined(row.id) ?? toStringOrUndefined(row.uuid)
  const title = toStringOrUndefined(row.title)
  const message = toStringOrUndefined(row.message) ?? toStringOrUndefined(row.body)
  const typeRaw = toStringOrUndefined(row.type) ?? toStringOrUndefined(row.announcement_type)
  const type =
    typeRaw === 'success' || typeRaw === 'warning' || typeRaw === 'error' || typeRaw === 'info'
      ? typeRaw
      : 'info'
  const active = toBooleanOrUndefined(row.active) ?? true
  const publishedAt =
    toStringOrUndefined(row.publishedAt) ?? toStringOrUndefined(row.published_at) ?? new Date().toISOString()

  if (!id || !title || !message) return null

  return { id, title, message, type, publishedAt, expiresAt: toStringOrUndefined(row.expiresAt) ?? undefined, active }
}

export async function fetchAnnouncementsFromSupabase(): Promise<Announcement[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  try {
    const { data, error } = await supabase.from('announcements').select('*')
    if (error || !data) return []

    const mapped = (data as Record<string, unknown>[])
      .map((row) => mapAnnouncementRow(row))
      .filter(Boolean) as Announcement[]

    return mapped
  } catch {
    return []
  }
}

export async function upsertAnnouncementInSupabase(
  announcement: Partial<Announcement> & { id: string },
): Promise<boolean> {
  const supabase = getSupabaseClient()
  if (!supabase) return false

  try {
    await supabase.from('announcements').upsert(announcement as any, { onConflict: 'id' })
    return true
  } catch {
    return false
  }
}

export async function deleteAnnouncementFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  if (!supabase) return false

  try {
    const { error } = await supabase.from('announcements').delete().eq('id', id)
    return !error
  } catch {
    return false
  }
}

