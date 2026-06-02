import { db, staff_roles } from './server'
import { createCrudService } from './base-crud'
import type { StaffRole } from './server'

export const staffRoleService = createCrudService<StaffRole, any, any>(staff_roles)

export async function fetchStaffRolesFromDrizzle(): Promise<StaffRole[]> {
  return staffRoleService.search()
}

export async function deleteStaffRoleFromDrizzle(id: string): Promise<boolean> {
  try {
    const result = await staffRoleService.unlink(id)
    return result.success
  } catch {
    return false
  }
}
