import { db } from '@/lib/drizzle/server'
import { resUsers, type ResUser } from '@/lib/drizzle/schema'
import { eq } from 'drizzle-orm'
import { createCrudService } from './base-crud'

type CreateUserData = typeof resUsers.$inferInsert

export const userService = createCrudService<ResUser, any, any>(resUsers)

export async function createUser(data: CreateUserData): Promise<ResUser> {
  const [user] = await db.insert(resUsers).values(data).returning()
  return user
}

export async function createUsers(data: CreateUserData[]): Promise<ResUser[]> {
  return db.insert(resUsers).values(data).returning()
}

export async function getUser(id: string): Promise<ResUser | null> {
  const [user] = await db.select().from(resUsers).where(eq(resUsers.id, id)).limit(1)
  return user ?? null
}

export async function getUserByAuthId(authUserId: string): Promise<ResUser | null> {
  const [user] = await db.select().from(resUsers).where(eq(resUsers.authUserId, authUserId)).limit(1)
  return user ?? null
}

export async function getUsers(): Promise<ResUser[]> {
  return db.select().from(resUsers)
}

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
