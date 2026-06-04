import { db } from './client'
import { m2m_roles_permissions } from '@/drizzle/schema'
import { syncRolePermissions } from './m2m/roles-permissions'

export async function fetchRolePermissionsFromDrizzle() {
  try {
    return await db.select().from(m2m_roles_permissions)
  } catch {
    return []
  }
}

export async function deleteRolePermissionFromDrizzle(id: string) {
  return false
}

export { syncRolePermissions }
