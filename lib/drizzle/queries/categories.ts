import { db, product_categories } from '../server'
import { createCrudService } from './base-crud'
import type { ProductCategory } from '@/lib/drizzle/schema'

export const categoryService = createCrudService<ProductCategory, any, any>(
  product_categories
)

export async function fetchCategoriesFromDrizzle(): Promise<ProductCategory[]> {
  return categoryService.search()
}

export async function fetchCategoryFromDrizzle(categoryId: string): Promise<ProductCategory | null> {
  return categoryService.read(categoryId)
}

export async function deleteCategoryFromDrizzle(categoryId: string): Promise<boolean> {
  const result = await categoryService.unlink(categoryId)
  return result.success
}
