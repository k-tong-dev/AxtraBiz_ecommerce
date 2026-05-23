import { db, product_brand } from './server'
import { createCrudService } from './base-crud'
import type { Brand } from './server'

export const brandService = createCrudService<Brand, any, any>(
  product_brand
)

export async function fetchBrandsFromDrizzle(): Promise<Brand[]> {
  return brandService.search()
}

export async function fetchBrandFromDrizzle(brandId: string): Promise<Brand | null> {
  return brandService.read(brandId)
}

export async function upsertBrandInDrizzle(brand: Brand, userId?: string): Promise<{ success: boolean; data?: any; error?: string }> {
  const result = await brandService.upsert(brand, userId)
  return { success: result.success, data: result.data, error: result.error }
}

export async function deleteBrandFromDrizzle(brandId: string): Promise<boolean> {
  const result = await brandService.unlink(brandId)
  return result.success
}
