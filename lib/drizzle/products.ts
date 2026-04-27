import { db, products } from './server'
import { createCrudService } from './base-crud'
import type { Product } from './server'
import { deleteAttachmentsByResModelAndResId } from './ir_attachment'

// Create CRUD service for products
export const productService = createCrudService<Product, any, any>(
  products
)

// Convenience functions that match the old API
export async function fetchProductsFromDrizzle(): Promise<Product[]> {
  return productService.search()
}

export async function fetchProductFromDrizzle(productId: string): Promise<Product | null> {
  return productService.read(productId)
}

export async function upsertProductInDrizzle(product: Product): Promise<{ success: boolean; error?: string }> {
  const result = await productService.upsert(product)
  return { success: result.success, error: result.error }
}

export async function deleteProductFromDrizzle(productId: string): Promise<boolean> {
  try {
    // First, delete all attachments for this product
    await deleteAttachmentsByResModelAndResId('products', productId)
    
    // Then delete the product using the service
    const result = await productService.unlink(productId)
    return result.success
  } catch {
    return false
  }
}

export async function deleteProductsFromDrizzle(productIds: string[]): Promise<boolean> {
  try {
    // First, delete all attachments for these products
    await Promise.all(
      productIds.map((id) => deleteAttachmentsByResModelAndResId('products', id))
    )
    
    // Then delete the products using the service
    const results = await Promise.all(productIds.map((id) => productService.unlink(id)))
    return results.every(r => r.success)
  } catch {
    return false
  }
}
