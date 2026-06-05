import { createCrudService } from './base-crud'
import { resUsers, type ResUser } from '@/lib/drizzle/schema'

export const resUserService = createCrudService<ResUser, any, any>(resUsers)

export async function fetchStaffAccountsFromDrizzle(): Promise<ResUser[]> {
  return resUserService.search()
}

export async function fetchStaffAccountFromDrizzle(id: string): Promise<ResUser | null> {
  return resUserService.read(id)
}

export async function deleteStaffAccountFromDrizzle(id: string): Promise<boolean> {
  try {
    const result = await resUserService.unlink(id)
    return result.success
  } catch {
    return false
  }
}
