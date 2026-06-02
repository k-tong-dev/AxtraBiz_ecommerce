import { db, permissions } from './server'
import { createCrudService } from './base-crud'
import type { Permission } from './server'

export const permissionService = createCrudService<Permission, any, any>(permissions)

export async function fetchPermissionsFromDrizzle(): Promise<Permission[]> {
  return permissionService.search()
}

export async function fetchPermissionFromDrizzle(id: string): Promise<Permission | null> {
  return permissionService.read(id)
}

export async function deletePermissionFromDrizzle(id: string): Promise<boolean> {
  try {
    const result = await permissionService.unlink(id)
    return result.success
  } catch {
    return false
  }
}
