import { db } from '../client'
import { m2mGroupsPermissions } from '@/lib/drizzle/schema'
import { syncRolePermissions } from '../m2m/roles-permissions'

export async function fetchRolePermissionsFromDrizzle() {
  try {
    return await db.select().from(m2mGroupsPermissions)
  } catch {
    return []
  }
}

export async function deleteRolePermissionFromDrizzle(id: string) {
  return false
}

export { syncRolePermissions }
