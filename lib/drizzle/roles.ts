import { db, resGroups } from './server'
import { createCrudService } from './base-crud'
import type { ResGroup } from './server'

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
