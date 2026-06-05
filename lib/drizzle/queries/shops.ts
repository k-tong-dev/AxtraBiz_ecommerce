import { createCrudService } from './base-crud'
import {resShops , type ResShop } from '@/lib/drizzle/schema'

export const shopService = createCrudService<ResShop, any, any>(resShops)

export async function fetchShopsFromDrizzle(): Promise<ResShop[]> {
  return shopService.search()
}

export async function fetchShopFromDrizzle(shopId: string): Promise<ResShop | null> {
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
