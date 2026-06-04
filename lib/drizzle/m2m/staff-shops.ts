import { db } from '@/lib/drizzle/client'
import { m2m_staff_accounts_shops } from '@/drizzle/schema'
import { eq, and } from 'drizzle-orm'

export interface AssignStaffShopInput {
  staffId: number
  shopId: number
  isDefault?: boolean
  assignedBy?: string
}

export interface SyncStaffShopsInput {
  staffId: number
  shopIds: number[]
  assignedBy?: string
}

export async function assignStaffShop(input: AssignStaffShopInput) {
  try {
    await db.insert(m2m_staff_accounts_shops)
      .values({
        staff_id: input.staffId,
        shop_id: input.shopId,
        is_default: input.isDefault ?? false,
        assigned_by: input.assignedBy,
      })
      .onConflictDoNothing()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to assign shop' }
  }
}

export async function removeStaffShop(staffId: number, shopId: number) {
  try {
    await db.delete(m2m_staff_accounts_shops)
      .where(and(
        eq(m2m_staff_accounts_shops.staff_id, staffId),
        eq(m2m_staff_accounts_shops.shop_id, shopId),
      ))
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to remove shop' }
  }
}

export async function syncStaffShops(input: SyncStaffShopsInput) {
  try {
    await db.delete(m2m_staff_accounts_shops)
      .where(eq(m2m_staff_accounts_shops.staff_id, input.staffId))

    if (input.shopIds.length > 0) {
      await db.insert(m2m_staff_accounts_shops)
        .values(input.shopIds.map((shopId, i) => ({
          staff_id: input.staffId,
          shop_id: shopId,
          is_default: i === 0,
          assigned_by: input.assignedBy,
        })))
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to sync shops' }
  }
}

export async function getStaffShops(staffId: number) {
  try {
    return await db.select()
      .from(m2m_staff_accounts_shops)
      .where(eq(m2m_staff_accounts_shops.staff_id, staffId))
  } catch {
    return []
  }
}
