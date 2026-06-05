import { createCrudService } from './base-crud'
import  { product_variants , type ProductVariant } from '@/lib/drizzle/schema'

// Create CRUD service for product variants
export const productVariantService = createCrudService<ProductVariant, any, any>(
  product_variants
)

// Convenience functions that match the pattern
export async function fetchProductVariantsFromDrizzle(productId?: string | number): Promise<ProductVariant[]> {
  if (productId) {
    return productVariantService.search(
      (product_variants as any).product_id.equals(productId)
    )
  }
  return productVariantService.search()
}

export async function fetchProductVariantFromDrizzle(variantId: string | number): Promise<ProductVariant | null> {
  return productVariantService.read(variantId)
}

export async function upsertProductVariantInDrizzle(
  variant: ProductVariant, 
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  const result = await productVariantService.upsert(variant, userId)
  return { success: result.success, error: result.error }
}

export async function deleteProductVariantFromDrizzle(variantId: string | number): Promise<boolean> {
  const result = await productVariantService.unlink(variantId)
  return result.success
}

export async function deleteProductVariantsByProductId(productId: string | number): Promise<boolean> {
  try {
    // Find all variants for this product
    const variants = await fetchProductVariantsFromDrizzle(productId)
    
    // Delete each variant
    const results = await Promise.all(
      variants.map(v => productVariantService.unlink(v.id))
    )
    
    return results.every(r => r.success)
  } catch {
    return false
  }
}

/**
 * Generate variants from attribute combinations
 * This is called when attributes are applied to a product
 */
export async function generateProductVariants(
  productId: number,
  attributes: Array<{
    attribute_id: number
    attribute_name: string
    values: Array<{ id: number; name: string; value: string }>
  }>,
  basePrice: number = 0,
  baseSku: string = '',
  userId?: string
): Promise<{ success: boolean; variants?: ProductVariant[]; error?: string }> {
  try {
    // Delete existing variants for this product
    await deleteProductVariantsByProductId(productId)

    // Generate all combinations of attribute values
    const combinations = generateCombinations(attributes)

    // Create variants for each combination
    const variants: ProductVariant[] = []
    
    for (let i = 0; i < combinations.length; i++) {
      const combination = combinations[i]
      
      // Build variant name from combination
      const variantName = combination.map(c => c.value_name).join(' / ')
      
      // Build SKU suffix from combination values
      const skuSuffix = combination.map(c => c.value).join('-')
      const sku = baseSku ? `${baseSku}-${skuSuffix}` : `${productId}-${skuSuffix}`
      
      // Build attribute data for the variant
      const attributeData = combination.map(c => ({
        attribute_id: c.attribute_id,
        attribute_name: c.attribute_name,
        value_id: c.value_id,
        value_name: c.value_name
      }))

      const variant: ProductVariant = {
        product_id: Number(productId),
        sku: sku.toUpperCase(),
        name: variantName,
        price: basePrice.toString(),
        stock: 0,
        active: true,
        attributes: attributeData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as ProductVariant

      const result = await productVariantService.create(variant, userId)
      if (result.success && result.data) {
        variants.push(result.data)
      }
    }

    return { success: true, variants }
  } catch (error) {
    console.error('[generateProductVariants] Error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate variants' 
    }
  }
}

/**
 * Helper: Generate all combinations of attribute values
 */
function generateCombinations(
  attributes: Array<{
    attribute_id: number
    attribute_name: string
    values: Array<{ id: number; name: string; value: string }>
  }>
): Array<Array<{
  attribute_id: number
  attribute_name: string
  value_id: number
  value_name: string
  value: string
}>> {
  if (attributes.length === 0) return []
  
  // Start with first attribute's values
  let combinations: Array<Array<{
    attribute_id: number
    attribute_name: string
    value_id: number
    value_name: string
    value: string
  }>> = attributes[0].values.map(v => [{
    attribute_id: attributes[0].attribute_id,
    attribute_name: attributes[0].attribute_name,
    value_id: v.id,
    value_name: v.name,
    value: v.value
  }])

  // Multiply with remaining attributes
  for (let i = 1; i < attributes.length; i++) {
    const attr = attributes[i]
    const newCombinations: typeof combinations = []
    
    for (const combo of combinations) {
      for (const value of attr.values) {
        newCombinations.push([
          ...combo,
          {
            attribute_id: attr.attribute_id,
            attribute_name: attr.attribute_name,
            value_id: value.id,
            value_name: value.name,
            value: value.value
          }
        ])
      }
    }
    
    combinations = newCombinations
  }

  return combinations
}

/**
 * Calculate total number of variants that would be generated
 */
export function calculateVariantCount(
  attributes: Array<{ values: any[] }>
): number {
  if (attributes.length === 0) return 0
  return attributes.reduce((count, attr) => count * (attr.values?.length || 1), 1)
}
