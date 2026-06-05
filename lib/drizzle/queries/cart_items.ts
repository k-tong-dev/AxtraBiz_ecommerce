import { db, cart_items } from '../server'
import { createCrudService } from './base-crud'
import type { CartItem } from '@/lib/drizzle/schema'

export const cartItemService = createCrudService<CartItem, any, any>(
  cart_items
)

export async function fetchCartItemsFromDrizzle(): Promise<CartItem[]> {
  return cartItemService.search()
}

export async function fetchCartItemFromDrizzle(id: string): Promise<CartItem | null> {
  return cartItemService.read(id)
}

export async function deleteCartItemFromDrizzle(id: string): Promise<boolean> {
  const result = await cartItemService.unlink(id)
  return result.success
}
