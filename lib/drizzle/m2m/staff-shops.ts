import { db } from '@/lib/drizzle/client'
import { m2mUsersShops } from '@/lib/drizzle/schema'
import { eq, and } from 'drizzle-orm'

export interface AssignStaffShopInput {
  userId: string
  shopId: string
  isDefault?: boolean
  assignedBy?: string
}

export interface SyncStaffShopsInput {
  userId: string
  shopIds: string[]
  assignedBy?: string
}

export async function assignStaffShop(input: AssignStaffShopInput) {
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

export async function removeStaffShop(userId: string, shopId: string) {
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

export async function syncStaffShops(input: SyncStaffShopsInput) {
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

export async function getStaffShops(userId: string) {
  try {
    return await db.select()
      .from(m2mUsersShops)
      .where(eq(m2mUsersShops.userId, userId))
  } catch {
    return []
  }
}
