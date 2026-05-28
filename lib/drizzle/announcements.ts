import { db, announcements } from '../drizzle/server'
import { createCrudService } from './base-crud'
import type { Announcement } from '../drizzle/server'

// Create CRUD service for announcements
export const announcementService = createCrudService<Announcement, any, any>(
  announcements
)

// Convenience functions that match the old API
export async function fetchAnnouncementsFromDrizzle(): Promise<Announcement[]> {
  return announcementService.search()
}

export async function fetchAnnouncementFromDrizzle(announcementId: string): Promise<Announcement | null> {
  return announcementService.read(announcementId)
}

export async function upsertAnnouncementInDrizzle(announcement: Announcement, userId?: string): Promise<{ success: boolean; data?: any; error?: string }> {
  const result = await announcementService.upsert(announcement, userId)
  return { success: result.success, data: result.data, error: result.error }
}

export async function deleteAnnouncementFromDrizzle(announcementId: string): Promise<boolean> {
  const result = await announcementService.unlink(announcementId)
  return result.success
}
