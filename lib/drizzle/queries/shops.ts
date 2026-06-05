import { db, shops } from '../server'
import { createCrudService } from './base-crud'
import type { Shop } from '@/lib/drizzle/schema'

export const shopService = createCrudService<Shop, any, any>(shops)

export async function fetchShopsFromDrizzle(): Promise<Shop[]> {
  return shopService.search()
}

export async function fetchShopFromDrizzle(shopId: string): Promise<Shop | null> {
  return shopService.read(shopId)
}

export async function deleteShopFromDrizzle(shopId: string): Promise<boolean> {
  try {
    const result = await shopService.unlink(shopId)
    return result.success
  } catch {
    return false
  }
}
