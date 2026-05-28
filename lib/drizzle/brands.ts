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

export async function deleteBrandFromDrizzle(brandId: string): Promise<boolean> {
  try {
    const result = await brandService.unlink(brandId)
    return result.success
  } catch {
    return false
  }
}
