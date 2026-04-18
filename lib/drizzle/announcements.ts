import { db, announcements } from '../drizzle/server'
import { eq } from 'drizzle-orm'
import type { Announcement } from '../drizzle/server'

export async function fetchAnnouncementsFromDrizzle(): Promise<Announcement[]> {
  try {
    const allAnnouncements = await db.select().from(announcements)
    return allAnnouncements
  } catch {
    return []
  }
}

export async function fetchAnnouncementFromDrizzle(announcementId: string): Promise<Announcement | null> {
  try {
    const [announcement] = await db
      .select()
      .from(announcements)
      .where(eq(announcements.id, announcementId))
      .limit(1)
    
    return announcement || null
  } catch {
    return null
  }
}

export async function upsertAnnouncementInDrizzle(announcement: Announcement): Promise<{ success: boolean; error?: string }> {
  try {
    const existingAnnouncement = await fetchAnnouncementFromDrizzle(announcement.id)
    
    if (existingAnnouncement) {
      // Update existing announcement
      await db
        .update(announcements)
        .set(announcement as any)
        .where(eq(announcements.id, announcement.id))
    } else {
      // Insert new announcement
      await db.insert(announcements).values(announcement as any)
    }
    
    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }
}

export async function deleteAnnouncementFromDrizzle(announcementId: string): Promise<boolean> {
  try {
    await db.delete(announcements).where(eq(announcements.id, announcementId))
    return true
  } catch {
    return false
  }
}
