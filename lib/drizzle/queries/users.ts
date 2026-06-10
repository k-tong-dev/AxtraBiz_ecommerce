import { db } from '@/lib/drizzle/server'
import { resUsers, resShops, resGroups, m2mUsersShops, m2mUsersGroups, type ResUser, type NewResUser } from '@/lib/drizzle/schema'
import { eq, inArray } from 'drizzle-orm'
import { createCrudService } from './base-orm/base-crud'
import { getCurrentUserId } from '@/lib/utils/current-user'
export { getCurrentUserId }

type CreateUserData = typeof resUsers.$inferInsert

export const userService = createCrudService<ResUser, any, any>(resUsers)

export async function createUser(data: CreateUserData): Promise<ResUser> {
  const result = await userService.create(data)
  if (!result.success || !result.data) throw new Error(result.error || 'Failed to create user')
  return result.data as ResUser
}

export async function createUsers(data: CreateUserData[]): Promise<ResUser[]> {
  const result = await userService.create(data)
  if (!result.success) throw new Error(result.error || 'Failed to create users')
  return result.data as unknown as ResUser[]
}

export async function getUser(id: string): Promise<ResUser | null> {
  const [user] = await db.select().from(resUsers).where(eq(resUsers.id, id)).limit(1)
  return user ?? null
}

// USED FOR GET USER FROM [ res_user ] ID FOR SOMETHING GET DATA FROM FIELD M2M.
export async function getUserByAuthId() {
  const userAuthId = await getCurrentUserId()
  if (!userAuthId) return null
  const [user] = await db.select().from(resUsers).where(eq(resUsers.authUserId, userAuthId)).limit(1)
  return user ?? null
}

export async function getUsers(): Promise<ResUser[]> {
  return db.select().from(resUsers)
}

export async function getUserByShop(shopId: number): Promise<ResUser | []> {
  if (!shopId) return []
  const users:any = await userService.search(eq(resUsers.shopId, shopId))
  return users ?? []
}

export async function enrichUserWithM2M(user: any, id: string) {
  const result: any = { ...user }

  const shopRecords = await db.select()
    .from(m2mUsersShops)
    .where(eq(m2mUsersShops.userId, id))
  if (shopRecords.length > 0) {
    const shopIds = shopRecords.map(r => r.shopId)
    const shops = await db.select({ id: resShops.id, name: resShops.name, logo: resShops.logo })
      .from(resShops)
      .where(inArray(resShops.id, shopIds))
    // @ts-ignore
    result.shop_ids = shops.map(s => ({ ...s, logo_url: s.logo?.url || null, logo: undefined }))
  } else {
    result.shop_ids = []
  }

  const groupRecords = await db.select()
    .from(m2mUsersGroups)
    .where(eq(m2mUsersGroups.userId, id))
  if (groupRecords.length > 0) {
    const groupIds = groupRecords.map(r => r.groupId)
    const groups = await db.select({ id: resGroups.id, name: resGroups.name })
      .from(resGroups)
      .where(inArray(resGroups.id, groupIds))
    result.group_ids = groups
  } else {
    result.group_ids = []
  }

  return result
}

export async function enrichUsersWithM2M(users: any[]) {
  if (!users.length) return []
  const ids = users.map(u => u.id)
  const shopRecords = await db.select().from(m2mUsersShops).where(inArray(m2mUsersShops.userId, ids))
  const groupRecords = await db.select().from(m2mUsersGroups).where(inArray(m2mUsersGroups.userId, ids))

  const shopMap: Record<string, any[]> = {}
  for (const r of shopRecords) {
    if (!shopMap[r.userId]) shopMap[r.userId] = []
    shopMap[r.userId].push(r.shopId)
  }
  const allShopIds = [...new Set(shopRecords.map(r => r.shopId))]
  const shops = allShopIds.length > 0
    ? await db.select({ id: resShops.id, name: resShops.name, logo: resShops.logo }).from(resShops).where(inArray(resShops.id, allShopIds))
    : []
  const shopById: Record<number, any> = {}
  for (const s of shops) { // @ts-ignore
    shopById[s.id] = { ...s, logo_url: s.logo?.url || null, logo: undefined }
  }

  const groupMap: Record<string, any[]> = {}
  for (const r of groupRecords) {
    if (!groupMap[r.userId]) groupMap[r.userId] = []
    groupMap[r.userId].push(r.groupId)
  }
  const allGroupIds = [...new Set(groupRecords.map(r => r.groupId))]
  const groups = allGroupIds.length > 0
    ? await db.select({ id: resGroups.id, name: resGroups.name }).from(resGroups).where(inArray(resGroups.id, allGroupIds))
    : []
  const groupById: Record<number, any> = {}
  for (const g of groups) groupById[g.id] = g

  return users.map(u => {
    const userShopIds = shopMap[u.id] || []
    const userGroupIds = groupMap[u.id] || []
    return {
      ...u,
      shop_ids: userShopIds.map(id => shopById[id]).filter(Boolean),
      group_ids: userGroupIds.map(id => groupById[id]).filter(Boolean),
    }
  })
}

/**
 * Check if a res_users profile exists for the given Supabase auth user.
 * If not, create one from the auth user's metadata.
 * Called after SignIn, Google OAuth, and OTP signup to ensure a profile always exists.
 */
export async function checkCreateUserIfNotExit(email: string, userMetadata?: Record<string, unknown> | null): Promise<{ user: ResUser; created: boolean }> {
  const authUserId = await getUserByAuthId()
  if (authUserId) {
    return { user: authUserId, created: false }
  }

  const username = email?.split('@')[0]?.replace(/[^a-zA-Z0-9_]/g, '_') || `user_${authUserId}`
  const created = await createUser({
    authUserId,
    username,
    email,
    displayName: (userMetadata?.full_name as string) ||
                 (userMetadata?.name as string) ||
                 username,
    phone: (userMetadata?.phone as string) || null,
    country: (userMetadata?.country as string) || null,
    userRole: 'new',
    isVerified: false,
    isShopOwner: false,
    createdBy: authUserId,
    updatedBy: authUserId,
  })

  return { user: created, created: true }
}

// ── Legacy wrappers for existing consumers ──

export async function fetchUsersFromDrizzle(): Promise<ResUser[]> {
  return getUsers()
}

export async function fetchUserFromDrizzle(id: string): Promise<ResUser | null> {
  return getUser(id)
}

export async function deleteUserFromDrizzle(id: string): Promise<boolean> {
  const result = await db.delete(resUsers).where(eq(resUsers.id, id)).returning({ id: resUsers.id })
  return result.length > 0
}