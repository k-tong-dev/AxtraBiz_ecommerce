import { createCrudService } from './base-crud'
import {menus,  type Menu } from '@/lib/drizzle/schema'

export const menuService = createCrudService<Menu, any, any>(
  menus
)

export async function fetchMenusFromDrizzle(): Promise<Menu[]> {
  return menuService.search()
}

export async function fetchMenuFromDrizzle(id: string): Promise<Menu | null> {
  return menuService.read(id)
}

export async function deleteMenuFromDrizzle(id: string): Promise<boolean> {
  const result = await menuService.unlink(id)
  return result.success
}
