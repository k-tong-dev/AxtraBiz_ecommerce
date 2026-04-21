import { db, products } from './server'
import { eq } from 'drizzle-orm'
import type { Product } from './server'
import { deleteAttachmentsByResModelAndResId } from './ir_attachment'

export async function fetchProductsFromDrizzle(): Promise<Product[]> {
  try {
    const allProducts = await db.select().from(products)
    return allProducts
  } catch {
    return []
  }
}

export async function fetchProductFromDrizzle(productId: string): Promise<Product | null> {
  try {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1)
    
    return product || null
  } catch {
    return null
  }
}

export async function upsertProductInDrizzle(product: Product): Promise<{ success: boolean; error?: string }> {
  try {
    const existingProduct = await fetchProductFromDrizzle(product.id)
    
    if (existingProduct) {
      // Update existing product
      await db
        .update(products)
        .set(product as any)
        .where(eq(products.id, product.id))
    } else {
      // Insert new product
      await db.insert(products).values(product as any)
    }
    
    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }
}

export async function deleteProductFromDrizzle(productId: string): Promise<boolean> {
  try {
    // First, delete all attachments for this product
    await deleteAttachmentsByResModelAndResId('products', productId)
    
    // Then delete the product
    await db.delete(products).where(eq(products.id, productId))
    return true
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
    
    // Then delete the products
    await Promise.all(productIds.map((id) => db.delete(products).where(eq(products.id, id))))
    return true
  } catch {
    return false
  }
}
