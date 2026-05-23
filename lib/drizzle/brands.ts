import { db, product_brand, ir_attachment } from './server'
import { eq, inArray } from 'drizzle-orm'
import { createCrudService } from './base-crud'
import type { Brand } from './server'
import { deleteAttachmentsByResModelAndResId } from './ir_attachment'

export const brandService = createCrudService<Brand, any, any>(
  product_brand
)

export interface BrandWithLogo extends Brand {
  logo_url?: string | null
}

async function attachLogoUrl(brands: Brand[]): Promise<BrandWithLogo[]> {
  if (brands.length === 0) return []
  const ids = brands.map((b) => b.logo_id).filter(Boolean) as string[]
  if (ids.length === 0) return brands as BrandWithLogo[]

  const attachments = await db
    .select({ id: ir_attachment.id, url: ir_attachment.url })
    .from(ir_attachment)
    .where(inArray(ir_attachment.id, ids))

  const urlMap = Object.fromEntries(attachments.map((a) => [a.id, a.url]))
  return brands.map((b) => ({ ...b, logo_url: b.logo_id ? urlMap[b.logo_id] || null : null }))
}

export async function fetchBrandsFromDrizzle(): Promise<BrandWithLogo[]> {
  const brands = await brandService.search()
  return attachLogoUrl(brands)
}

export async function fetchBrandFromDrizzle(brandId: string): Promise<BrandWithLogo | null> {
  const brand = await brandService.read(brandId)
  if (!brand) return null
  const [withLogo] = await attachLogoUrl([brand])
  return withLogo
}

export async function upsertBrandInDrizzle(brand: Brand, userId?: string): Promise<{ success: boolean; data?: any; error?: string }> {
  const result = await brandService.upsert(brand, userId)
  return { success: result.success, data: result.data, error: result.error }
}

export async function deleteBrandFromDrizzle(brandId: string): Promise<boolean> {
  try {
    await deleteAttachmentsByResModelAndResId('brands', brandId)
    const result = await brandService.unlink(brandId)
    return result.success
  } catch {
    return false
  }
}
