import { db, users } from '../drizzle/server'
import { eq } from 'drizzle-orm'
import type { User } from '../drizzle/server'

export async function fetchUsersFromDrizzle(): Promise<User[]> {
  try {
    const allUsers = await db.select().from(users)
    return allUsers
  } catch {
    return []
  }
}

export async function fetchUserFromDrizzle(userId: string): Promise<User | null> {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
    
    return user || null
  } catch {
    return null
  }
}

export async function upsertUserInDrizzle(user: User): Promise<{ success: boolean; error?: string }> {
  try {
    const existingUser = await fetchUserFromDrizzle(user.id)
    
    if (existingUser) {
      // Update existing user
      await db
        .update(users)
        .set(user as any)
        .where(eq(users.id, user.id))
    } else {
      // Insert new user
      await db.insert(users).values(user as any)
    }
    
    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }
}

export async function deleteUserFromDrizzle(userId: string): Promise<boolean> {
  try {
    await db.delete(users).where(eq(users.id, userId))
    return true
  } catch {
    return false
  }
}
