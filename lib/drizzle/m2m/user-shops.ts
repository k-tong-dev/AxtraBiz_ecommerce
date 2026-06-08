import { db } from '@/lib/drizzle/client'
import { m2mUsersShops } from '@/lib/drizzle/schema'
import { eq, and } from 'drizzle-orm'
import {getCurrentUserId, getUserByAuthId} from "@/lib/drizzle/queries/users";

export interface AssignUserShopInput {
  userId: string
  shopId: number
  isDefault?: boolean
  assignedBy?: string
}

export interface SyncUserShopsInput {
  userId: string
  shopIds: number[]
  assignedBy?: string
}

export async function assignUserShop(input: AssignUserShopInput) {
  try {
    await db.insert(m2mUsersShops)
      .values({
        userId: input.userId,
        shopId: input.shopId,
        isDefault: input.isDefault ?? false,
        assignedBy: input.assignedBy,
      })
      .onConflictDoNothing()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to assign shop' }
  }
}

export async function removeUserShop(userId: string, shopId: number) {
  try {
    await db.delete(m2mUsersShops)
      .where(and(
        eq(m2mUsersShops.userId, userId),
        eq(m2mUsersShops.shopId, shopId),
      ))
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to remove shop' }
  }
}

export async function syncUserShops(input: SyncUserShopsInput) {
  try {
    await db.delete(m2mUsersShops)
      .where(eq(m2mUsersShops.userId, input.userId))

    if (input.shopIds.length > 0) {
      await db.insert(m2mUsersShops)
        .values(input.shopIds.map((shopId, i) => ({
          userId: input.userId,
          shopId,
          isDefault: i === 0,
          assignedBy: input.assignedBy,
        })))
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to sync shops' }
  }
}

export async function getUserShops() {
  try {
    const userAuthId = await getCurrentUserId()
    if (!userAuthId) return []
    const user = await getUserByAuthId()
    if (!user) return []

    return await db.select()
      .from(m2mUsersShops)
      .where(eq(m2mUsersShops.userId, user?.id))
  } catch {
    return []
  }
}
