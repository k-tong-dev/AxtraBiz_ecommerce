import { db, staff_accounts } from './server'
import { createCrudService } from './base-crud'
import type { StaffAccount } from './server'

export const staffAccountService = createCrudService<StaffAccount, any, any>(staff_accounts)

export async function fetchStaffAccountsFromDrizzle(): Promise<StaffAccount[]> {
  return staffAccountService.search()
}

export async function fetchStaffAccountFromDrizzle(id: string): Promise<StaffAccount | null> {
  return staffAccountService.read(id)
}

export async function deleteStaffAccountFromDrizzle(id: string): Promise<boolean> {
  try {
    const result = await staffAccountService.unlink(id)
    return result.success
  } catch {
    return false
  }
}
