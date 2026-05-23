import { db, product_categories } from './server'
import { createCrudService } from './base-crud'
import type { ProductCategory } from './server'

export const categoryService = createCrudService<ProductCategory, any, any>(
  product_categories
)

export async function fetchCategoriesFromDrizzle(): Promise<ProductCategory[]> {
  return categoryService.search()
}

export async function fetchCategoryFromDrizzle(categoryId: string): Promise<ProductCategory | null> {
  return categoryService.read(categoryId)
}

export async function upsertCategoryInDrizzle(category: ProductCategory, userId?: string): Promise<{ success: boolean; data?: any; error?: string }> {
  const result = await categoryService.upsert(category, userId)
  return { success: result.success, data: result.data, error: result.error }
}

export async function deleteCategoryFromDrizzle(categoryId: string): Promise<boolean> {
  const result = await categoryService.unlink(categoryId)
  return result.success
}
