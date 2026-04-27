import { db, settings } from '../drizzle/server'
import { createCrudService } from './base-crud'
import type { Setting } from '../drizzle/server'

// Create CRUD service for settings
export const settingService = createCrudService<Setting, any, any>(
  settings
)

// Convenience functions that match the old API
export async function fetchSettingsFromDrizzle(): Promise<Setting[]> {
  return settingService.search()
}

export async function fetchSettingFromDrizzle(settingId: string): Promise<Setting | null> {
  return settingService.read(settingId)
}

export async function upsertSettingInDrizzle(setting: Setting): Promise<{ success: boolean; error?: string }> {
  const result = await settingService.upsert(setting)
  return { success: result.success, error: result.error }
}

export async function deleteSettingFromDrizzle(settingId: string): Promise<boolean> {
  const result = await settingService.unlink(settingId)
  return result.success
}
