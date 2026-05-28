import { db, product_template } from './server'
import { createCrudService } from './base-crud'
import { eq } from 'drizzle-orm'
import type { ProductTemplate } from './server'

export const productService = createCrudService<ProductTemplate, any, any>(
  product_template
)

export async function fetchProductsFromDrizzle(): Promise<ProductTemplate[]> {
  return productService.search(eq(product_template.active, true))
}

export async function fetchProductFromDrizzle(productId: string): Promise<ProductTemplate | null> {
  return productService.read(productId)
}

export async function upsertProductInDrizzle(product: ProductTemplate, userId?: string): Promise<{ success: boolean; data?: any; error?: string }> {
  const result = await productService.upsert(product, userId)
  return { success: result.success, data: result.data, error: result.error }
}

export async function deleteProductFromDrizzle(productId: string): Promise<boolean> {
  try {
    const result = await productService.unlink(productId)
    return result.success
  } catch {
    return false
  }
}

export async function deleteProductsFromDrizzle(productIds: string[]): Promise<boolean> {
  try {
    const results = await Promise.all(productIds.map((id) => productService.unlink(id)))
    return results.every(r => r.success)
  } catch {
    return false
  }
}
