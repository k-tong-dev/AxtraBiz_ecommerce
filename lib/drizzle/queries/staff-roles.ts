import { db } from '../client'
import { m2mUsersGroups } from '@/lib/drizzle/schema'
import { syncStaffRoles } from '../m2m/staff-roles'

export async function fetchStaffRolesFromDrizzle() {
  try {
    return await db.select().from(m2mUsersGroups)
  } catch {
    return []
  }
}

export async function deleteStaffRoleFromDrizzle(id: string) {
  return false
}

export { syncStaffRoles }
