import { db, announcements } from '../server'
import { createCrudService } from './base-crud'
import type { Announcement } from '@/lib/drizzle/schema'

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

export async function deleteAnnouncementFromDrizzle(announcementId: string): Promise<boolean> {
  const result = await announcementService.unlink(announcementId)
  return result.success
}
