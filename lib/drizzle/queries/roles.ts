import { createCrudService } from './base-orm/base-crud'
import { resGroups, type ResGroup } from '@/lib/drizzle/schema'

export const groupService = createCrudService<ResGroup, any, any>(resGroups)

export async function fetchRolesFromDrizzle(): Promise<ResGroup[]> {
  return groupService.search()
}

export async function fetchRoleFromDrizzle(id: string): Promise<ResGroup | null> {
  return groupService.read(id)
}

export async function deleteRoleFromDrizzle(id: string): Promise<boolean> {
  try {
    const result = await groupService.unlink(id)
    return result.success
  } catch {
    return false
  }
}
