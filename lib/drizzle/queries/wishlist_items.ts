import { createCrudService } from './base-crud'
import { wishlist_items, type  WishlistItem } from '@/lib/drizzle/schema'

export const wishlistItemService = createCrudService<WishlistItem, any, any>(
  wishlist_items
)

export async function fetchWishlistItemsFromDrizzle(): Promise<WishlistItem[]> {
  return wishlistItemService.search()
}

export async function fetchWishlistItemFromDrizzle(id: string): Promise<WishlistItem | null> {
  return wishlistItemService.read(id)
}

export async function deleteWishlistItemFromDrizzle(id: string): Promise<boolean> {
  const result = await wishlistItemService.unlink(id)
  return result.success
}
