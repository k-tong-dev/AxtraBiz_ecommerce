import { db } from '@/lib/drizzle/client'
import { m2mUsersGroups } from '@/lib/drizzle/schema'
import { eq, and } from 'drizzle-orm'

export interface AssignUserGroupInput {
  userId: string
  groupId: number
  assignedBy?: string
}

export interface SyncUserGroupsInput {
  userId: string
  groupIds: number[]
  assignedBy?: string
}

export async function assignUserGroup(input: AssignUserGroupInput) {
  try {
    await db.insert(m2mUsersGroups)
      .values({
        userId: input.userId,
        groupId: input.groupId,
        assignedBy: input.assignedBy,
      })
      .onConflictDoNothing()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to assign group' }
  }
}

export async function removeUserGroup(userId: string, groupId: number) {
  try {
    await db.delete(m2mUsersGroups)
      .where(and(
        eq(m2mUsersGroups.userId, userId),
        eq(m2mUsersGroups.groupId, groupId),
      ))
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to remove group' }
  }
}

export async function syncUserGroups(input: SyncUserGroupsInput) {
  try {
    await db.delete(m2mUsersGroups)
      .where(eq(m2mUsersGroups.userId, input.userId))

    if (input.groupIds.length > 0) {
      await db.insert(m2mUsersGroups)
        .values(input.groupIds.map(groupId => ({
          userId: input.userId,
          groupId,
          assignedBy: input.assignedBy,
        })))
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to sync groups' }
  }
}

export async function getUserGroups(userId: string) {
  try {
    return await db.select()
      .from(m2mUsersGroups)
      .where(eq(m2mUsersGroups.userId, userId))
  } catch {
    return []
  }
}
