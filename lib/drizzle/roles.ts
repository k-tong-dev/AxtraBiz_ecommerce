import { db, roles } from './server'
import { createCrudService } from './base-crud'
import type { Role } from './server'

export const roleService = createCrudService<Role, any, any>(roles)

export async function fetchRolesFromDrizzle(): Promise<Role[]> {
  return roleService.search()
}

export async function fetchRoleFromDrizzle(id: string): Promise<Role | null> {
  return roleService.read(id)
}

export async function deleteRoleFromDrizzle(id: string): Promise<boolean> {
  try {
    const result = await roleService.unlink(id)
    return result.success
  } catch {
    return false
  }
}
