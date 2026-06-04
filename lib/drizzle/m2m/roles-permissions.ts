import { db } from '@/lib/drizzle/client'
import { m2m_roles_permissions } from '@/drizzle/schema'
import { eq, and, inArray } from 'drizzle-orm'

export interface AssignRolePermissionInput {
  roleId: number
  permissionId: number
  grantedBy?: string
}

export interface SyncRolePermissionsInput {
  roleId: number
  permissionIds: number[]
  grantedBy?: string
}

export async function assignRolePermission(input: AssignRolePermissionInput) {
  try {
    await db.insert(m2m_roles_permissions)
      .values({
        role_id: input.roleId,
        permission_id: input.permissionId,
        granted_by: input.grantedBy,
      })
      .onConflictDoNothing()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to assign permission' }
  }
}

export async function removeRolePermission(roleId: number, permissionId: number) {
  try {
    await db.delete(m2m_roles_permissions)
      .where(and(
        eq(m2m_roles_permissions.role_id, roleId),
        eq(m2m_roles_permissions.permission_id, permissionId),
      ))
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to remove permission' }
  }
}

export async function syncRolePermissions(input: SyncRolePermissionsInput) {
  try {
    await db.delete(m2m_roles_permissions)
      .where(eq(m2m_roles_permissions.role_id, input.roleId))

    if (input.permissionIds.length > 0) {
      await db.insert(m2m_roles_permissions)
        .values(input.permissionIds.map(permissionId => ({
          role_id: input.roleId,
          permission_id: permissionId,
          granted_by: input.grantedBy,
        })))
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to sync permissions' }
  }
}

export async function getRolePermissions(roleId: number) {
  try {
    return await db.select()
      .from(m2m_roles_permissions)
      .where(eq(m2m_roles_permissions.role_id, roleId))
  } catch {
    return []
  }
}
