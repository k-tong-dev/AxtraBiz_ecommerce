import { db, resUsers } from '../drizzle/server'
import { createCrudService } from './base-crud'
import type { ResUser } from '../drizzle/server'

export const userService = createCrudService<ResUser, any, any>(resUsers)

export async function fetchUsersFromDrizzle(): Promise<ResUser[]> {
  return userService.search()
}

export async function fetchUserFromDrizzle(userId: string): Promise<ResUser | null> {
  return userService.read(userId)
}

export async function deleteUserFromDrizzle(userId: string): Promise<boolean> {
  const result = await userService.unlink(userId)
  return result.success
}
