import { db } from '@/lib/drizzle/client'
import { m2mUsersGroups } from '@/lib/drizzle/schema'
import { eq, and } from 'drizzle-orm'

export interface AssignStaffRoleInput {
  userId: string
  groupId: string
  assignedBy?: string
}

export interface SyncStaffRolesInput {
  userId: string
  groupIds: string[]
  assignedBy?: string
}

export async function assignStaffRole(input: AssignStaffRoleInput) {
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
    return { success: false, error: error instanceof Error ? error.message : 'Failed to assign role' }
  }
}

export async function removeStaffRole(userId: string, groupId: string) {
  try {
    await db.delete(m2mUsersGroups)
      .where(and(
        eq(m2mUsersGroups.userId, userId),
        eq(m2mUsersGroups.groupId, groupId),
      ))
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to remove role' }
  }
}

export async function syncStaffRoles(input: SyncStaffRolesInput) {
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
    return { success: false, error: error instanceof Error ? error.message : 'Failed to sync roles' }
  }
}

export async function getStaffRoles(userId: string) {
  try {
    return await db.select()
      .from(m2mUsersGroups)
      .where(eq(m2mUsersGroups.userId, userId))
  } catch {
    return []
  }
}
