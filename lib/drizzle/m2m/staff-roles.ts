import { db } from '@/lib/drizzle/client'
import { m2m_staff_accounts_roles } from '@/drizzle/schema'
import { eq, and } from 'drizzle-orm'

export interface AssignStaffRoleInput {
  staffId: number
  roleId: number
  assignedBy?: string
}

export interface SyncStaffRolesInput {
  staffId: number
  roleIds: number[]
  assignedBy?: string
}

export async function assignStaffRole(input: AssignStaffRoleInput) {
  try {
    await db.insert(m2m_staff_accounts_roles)
      .values({
        staff_id: input.staffId,
        role_id: input.roleId,
        assigned_by: input.assignedBy,
      })
      .onConflictDoNothing()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to assign role' }
  }
}

export async function removeStaffRole(staffId: number, roleId: number) {
  try {
    await db.delete(m2m_staff_accounts_roles)
      .where(and(
        eq(m2m_staff_accounts_roles.staff_id, staffId),
        eq(m2m_staff_accounts_roles.role_id, roleId),
      ))
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to remove role' }
  }
}

export async function syncStaffRoles(input: SyncStaffRolesInput) {
  try {
    await db.delete(m2m_staff_accounts_roles)
      .where(eq(m2m_staff_accounts_roles.staff_id, input.staffId))

    if (input.roleIds.length > 0) {
      await db.insert(m2m_staff_accounts_roles)
        .values(input.roleIds.map(roleId => ({
          staff_id: input.staffId,
          role_id: roleId,
          assigned_by: input.assignedBy,
        })))
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to sync roles' }
  }
}

export async function getStaffRoles(staffId: number) {
  try {
    return await db.select()
      .from(m2m_staff_accounts_roles)
      .where(eq(m2m_staff_accounts_roles.staff_id, staffId))
  } catch {
    return []
  }
}
