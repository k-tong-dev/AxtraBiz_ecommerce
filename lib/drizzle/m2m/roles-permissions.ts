import { db } from '@/lib/drizzle/client'
import { m2mGroupsPermissions } from '@/lib/drizzle/schema'
import { eq, and } from 'drizzle-orm'

export interface AssignRolePermissionInput {
  groupId: number
  permissionId: number
  grantedBy?: string
}

export interface SyncRolePermissionsInput {
  groupId: number
  permissionIds: number[]
  grantedBy?: string
}

export async function assignRolePermission(input: AssignRolePermissionInput) {
  try {
    await db.insert(m2mGroupsPermissions)
      .values({
        groupId: input.groupId,
        permissionId: input.permissionId,
        grantedBy: input.grantedBy,
      })
      .onConflictDoNothing()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to assign permission' }
  }
}

export async function removeRolePermission(groupId: number, permissionId: number) {
  try {
    await db.delete(m2mGroupsPermissions)
      .where(and(
        eq(m2mGroupsPermissions.groupId, groupId),
        eq(m2mGroupsPermissions.permissionId, permissionId),
      ))
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to remove permission' }
  }
}

export async function syncRolePermissions(input: SyncRolePermissionsInput) {
  try {
    await db.delete(m2mGroupsPermissions)
      .where(eq(m2mGroupsPermissions.groupId, input.groupId))

    if (input.permissionIds.length > 0) {
      await db.insert(m2mGroupsPermissions)
        .values(input.permissionIds.map(permissionId => ({
          groupId: input.groupId,
          permissionId,
          grantedBy: input.grantedBy,
        })))
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to sync permissions' }
  }
}

export async function getRolePermissions(groupId: number) {
  try {
    return await db.select()
      .from(m2mGroupsPermissions)
      .where(eq(m2mGroupsPermissions.groupId, groupId))
  } catch {
    return []
  }
}
