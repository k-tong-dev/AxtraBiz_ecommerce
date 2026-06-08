import { db } from '@/lib/drizzle/server'
import { resUsers, type ResUser, type NewResUser } from '@/lib/drizzle/schema'
import { eq } from 'drizzle-orm'
import { createCrudService } from './base-orm/base-crud'
import {createClient} from "@/lib/utils/supabase-server";

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

export async function getCurrentUserId(): Promise<string | undefined> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    return data.user?.id
  } catch {
    return undefined
  }
}

export async function getCurrentShopId(): Promise<number | undefined> {
  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const val = cookieStore.get('active_shop_id')?.value
    if (!val) return undefined
    const n = Number(val)
    return Number.isNaN(n) ? undefined : n
  } catch {
    return undefined
  }
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