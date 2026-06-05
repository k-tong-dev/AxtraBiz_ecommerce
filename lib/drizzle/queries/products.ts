import { createCrudService } from './base-crud'
import { product_template, type ProductTemplate } from '@/lib/drizzle/schema'

export const productService = createCrudService<ProductTemplate, any, any>(
  product_template
)

export async function fetchProductsFromDrizzle(): Promise<ProductTemplate[]> {
  return productService.search()
}

export async function fetchProductFromDrizzle(productId: string): Promise<ProductTemplate | null> {
  return productService.read(productId)
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
