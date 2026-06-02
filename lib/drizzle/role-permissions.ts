import { db, role_permissions } from './server'
import { createCrudService } from './base-crud'
import type { RolePermission } from './server'

export const rolePermissionService = createCrudService<RolePermission, any, any>(role_permissions)

export async function fetchRolePermissionsFromDrizzle(): Promise<RolePermission[]> {
  return rolePermissionService.search()
}

export async function deleteRolePermissionFromDrizzle(id: string): Promise<boolean> {
  try {
    const result = await rolePermissionService.unlink(id)
    return result.success
  } catch {
    return false
  }
}
