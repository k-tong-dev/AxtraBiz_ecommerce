import { db } from '@/lib/drizzle/client'
import { resUsers, m2mUsersGroups, m2mGroupsPermissions, m2mUsersShops, resPermissions, resShops } from '@/lib/drizzle/schema'
import { eq, and } from 'drizzle-orm'

export async function getUserShops(userId: string) {
  const rows = await db.select({ shop: resShops })
    .from(m2mUsersShops)
    .innerJoin(resShops, eq(m2mUsersShops.shopId, resShops.id))
    .where(eq(m2mUsersShops.userId, userId))
  return rows.map(r => r.shop)
}

export async function hasShopAccess(userId: string, shopId: string): Promise<boolean> {
  const [row] = await db.select({ id: m2mUsersShops.userId })
    .from(m2mUsersShops)
    .where(and(eq(m2mUsersShops.userId, userId), eq(m2mUsersShops.shopId, shopId)))
    .limit(1)
  return !!row
}

export async function checkPermission(userId: string, permissionKey: string): Promise<boolean> {
  const rows = await db
    .select({ key: resPermissions.key })
    .from(m2mUsersGroups)
    .innerJoin(m2mGroupsPermissions, eq(m2mGroupsPermissions.groupId, m2mUsersGroups.groupId))
    .innerJoin(resPermissions, eq(resPermissions.id, m2mGroupsPermissions.permissionId))
    .where(eq(m2mUsersGroups.userId, userId))

  return rows.some(r => r.key === permissionKey)
}

export async function getUserDefaultShop(userId: string) {
  const [row] = await db.select({ shop: resShops })
    .from(m2mUsersShops)
    .innerJoin(resShops, eq(m2mUsersShops.shopId, resShops.id))
    .where(and(eq(m2mUsersShops.userId, userId), eq(m2mUsersShops.isDefault, true)))
    .limit(1)
  return row?.shop ?? null
}
