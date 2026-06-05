import { db } from '../client'
import { m2mGroupsPermissions } from '@/lib/drizzle/schema'
import { syncRolePermissions } from '@/lib/drizzle/m2m'

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
