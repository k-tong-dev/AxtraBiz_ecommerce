import { db, settings } from '../drizzle/server'
import { eq } from 'drizzle-orm'
import type { Setting } from '../drizzle/server'

export async function fetchSettingsFromDrizzle(): Promise<Setting[]> {
  try {
    const allSettings = await db.select().from(settings)
    return allSettings
  } catch {
    return []
  }
}

export async function fetchSettingFromDrizzle(settingId: string): Promise<Setting | null> {
  try {
    const [setting] = await db
      .select()
      .from(settings)
      .where(eq(settings.id, settingId))
      .limit(1)
    
    return setting || null
  } catch {
    return null
  }
}

export async function upsertSettingInDrizzle(setting: Setting): Promise<{ success: boolean; error?: string }> {
  try {
    const existingSetting = await fetchSettingFromDrizzle(setting.id)
    
    if (existingSetting) {
      // Update existing setting
      await db
        .update(settings)
        .set(setting as any)
        .where(eq(settings.id, setting.id))
    } else {
      // Insert new setting
      await db.insert(settings).values(setting as any)
    }
    
    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }
}

export async function deleteSettingFromDrizzle(settingId: string): Promise<boolean> {
  try {
    await db.delete(settings).where(eq(settings.id, settingId))
    return true
  } catch {
    return false
  }
}
