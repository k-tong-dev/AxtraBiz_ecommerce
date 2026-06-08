import { createCrudService } from './base-orm/base-crud'
import  { resPermissions, ResPermission } from '@/lib/drizzle/schema'

export const permissionService = createCrudService<ResPermission, any, any>(resPermissions)

export async function fetchPermissionsFromDrizzle(): Promise<ResPermission[]> {
  return permissionService.search()
}

export async function fetchPermissionFromDrizzle(id: string): Promise<ResPermission | null> {
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
