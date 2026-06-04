import { db } from './client'
import { resUsers } from '@/lib/drizzle/schema'
import { eq } from 'drizzle-orm'
import type { ResUser } from '@/lib/drizzle/schema'

export async function fetchPlatformAdminsFromDrizzle(): Promise<ResUser[]> {
  return db.select().from(resUsers)
    .where(eq(resUsers.userRole, '_admin_system_'))
    .orderBy(resUsers.email)
}

export async function fetchPlatformAdminFromDrizzle(id: string): Promise<ResUser | null> {
  const [result] = await db.select().from(resUsers)
    .where(eq(resUsers.id, id))
    .limit(1)
  return result || null
}

export async function createPlatformAdminFromDrizzle(
  data: Pick<ResUser, 'email' | 'displayName'>,
): Promise<ResUser | null> {
  const username = data.email.split('@')[0]
  const [result] = await db.insert(resUsers).values({
    ...data,
    authUserId: '',
    username,
    userRole: '_admin_system_',
  }).returning()
  return result || null
}

export async function updatePlatformAdminFromDrizzle(
  id: string,
  data: Partial<Pick<ResUser, 'email' | 'displayName'>>,
): Promise<ResUser | null> {
  const [result] = await db.update(resUsers)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(resUsers.id, id))
    .returning()
  return result || null
}

export async function deletePlatformAdminFromDrizzle(id: string): Promise<boolean> {
  const [result] = await db.delete(resUsers).where(eq(resUsers.id, id)).returning()
  return !!result
}
