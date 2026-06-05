import { db, product_reviews } from '../server'
import { createCrudService } from './base-crud'
import type { ProductReview } from '@/lib/drizzle/schema'

export const productReviewService = createCrudService<ProductReview, any, any>(
  product_reviews
)

export async function fetchProductReviewsFromDrizzle(): Promise<ProductReview[]> {
  return productReviewService.search()
}

export async function fetchProductReviewFromDrizzle(id: string): Promise<ProductReview | null> {
  return productReviewService.read(id)
}

export async function deleteProductReviewFromDrizzle(id: string): Promise<boolean> {
  const result = await productReviewService.unlink(id)
  return result.success
}
