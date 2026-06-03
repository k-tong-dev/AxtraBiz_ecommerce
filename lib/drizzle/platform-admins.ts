import { db } from './client'
import { platform_admins } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import type { PlatformAdmin } from '@/drizzle/schema'

export async function fetchPlatformAdminsFromDrizzle(): Promise<PlatformAdmin[]> {
  return db.select().from(platform_admins).orderBy(platform_admins.email)
}

export async function fetchPlatformAdminFromDrizzle(id: number): Promise<PlatformAdmin | null> {
  const [result] = await db.select().from(platform_admins).where(eq(platform_admins.id, id)).limit(1)
  return result || null
}

export async function createPlatformAdminFromDrizzle(
  data: Pick<PlatformAdmin, 'email' | 'full_name'>,
): Promise<PlatformAdmin> {
  const [result] = await db.insert(platform_admins).values(data).returning()
  return result
}

export async function updatePlatformAdminFromDrizzle(
  id: number,
  data: Partial<Pick<PlatformAdmin, 'email' | 'full_name' | 'last_login_at'>>,
): Promise<PlatformAdmin | null> {
  const [result] = await db.update(platform_admins)
    .set({ ...data, updated_at: new Date().toISOString() })
    .where(eq(platform_admins.id, id))
    .returning()
  return result || null
}

export async function deletePlatformAdminFromDrizzle(id: number): Promise<boolean> {
  const [result] = await db.delete(platform_admins).where(eq(platform_admins.id, id)).returning()
  return !!result
}
