import { db, users } from '../drizzle/server'
import { createCrudService } from './base-crud'
import type { User } from '../drizzle/server'

// Create CRUD service for users
export const userService = createCrudService<User, any, any>(
  users
)

// Convenience functions that match the old API
export async function fetchUsersFromDrizzle(): Promise<User[]> {
  return userService.search()
}

export async function fetchUserFromDrizzle(userId: string): Promise<User | null> {
  return userService.read(userId)
}

export async function upsertUserInDrizzle(user: User, userId?: string): Promise<{ success: boolean; error?: string }> {
  const result = await userService.upsert(user, userId)
  return { success: result.success, error: result.error }
}

export async function deleteUserFromDrizzle(userId: string): Promise<boolean> {
  const result = await userService.unlink(userId)
  return result.success
}
