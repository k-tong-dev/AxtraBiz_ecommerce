import { db } from './client'
import { m2m_staff_accounts_roles } from '@/drizzle/schema'
import { syncStaffRoles } from './m2m/staff-roles'

export async function fetchStaffRolesFromDrizzle() {
  try {
    return await db.select().from(m2m_staff_accounts_roles)
  } catch {
    return []
  }
}

export async function deleteStaffRoleFromDrizzle(id: string) {
  // id here is not used — junction records use composite key
  // For batch operations, use the m2m helper functions
  return false
}

export { syncStaffRoles }
