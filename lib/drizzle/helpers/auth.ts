import { db } from '@/lib/drizzle/client'
import { resUsers } from '@/lib/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function getUserWithRole(userId: string) {
  const [user] = await db.select().from(resUsers).where(eq(resUsers.id, userId)).limit(1)
  return user ?? null
}

export async function checkIsPlatformAdmin(userId: string): Promise<boolean> {
  const [user] = await db.select({ userRole: resUsers.userRole })
    .from(resUsers)
    .where(eq(resUsers.id, userId))
    .limit(1)
  return user?.userRole === '_admin_system_'
}

export async function checkIsBusinessOwner(userId: string): Promise<boolean> {
  const [user] = await db.select({ isShopOwner: resUsers.isShopOwner })
    .from(resUsers)
    .where(eq(resUsers.id, userId))
    .limit(1)
  return user?.isShopOwner === true
}

export async function checkIsEmployee(userId: string): Promise<boolean> {
  const [user] = await db.select({ userRole: resUsers.userRole })
    .from(resUsers)
    .where(eq(resUsers.id, userId))
    .limit(1)
  return user?.userRole === 'employee'
}
