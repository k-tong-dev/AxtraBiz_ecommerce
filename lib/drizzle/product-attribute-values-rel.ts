import { db, product_attribute_values_rel } from '../drizzle/server'
import { createCrudService } from './base-crud'
import { eq, and } from 'drizzle-orm'
import type { ProductAttributeValuesRel } from '../../drizzle/schema'

// Create CRUD service for attribute value relations
export const productAttributeValuesRelService = createCrudService<ProductAttributeValuesRel, any, any>(
  product_attribute_values_rel
)

// Convenience functions that match the pattern
export async function fetchProductAttributeValuesRelFromDrizzle(
  attributeId?: string,
  valueId?: string
): Promise<ProductAttributeValuesRel[]> {
  // Build query conditions
  let conditions = []
  if (attributeId) {
    conditions.push(eq(product_attribute_values_rel.attribute_id, attributeId))
  }
  if (valueId) {
    conditions.push(eq(product_attribute_values_rel.value_id, valueId))
  }

  // Search with conditions
  if (conditions.length > 0) {
    return productAttributeValuesRelService.search(and(...conditions))
  }
  return productAttributeValuesRelService.search()
}

export async function fetchProductAttributeValuesRelFromDrizzleById(
  relationId: string
): Promise<ProductAttributeValuesRel | null> {
  return productAttributeValuesRelService.read(relationId)
}

export async function upsertProductAttributeValuesRelInDrizzle(
  relation: ProductAttributeValuesRel,
  userId?: string
): Promise<{ success: boolean; error?: string; data?: ProductAttributeValuesRel }> {
  const result = await productAttributeValuesRelService.upsert(relation, userId)
  return { 
    success: result.success, 
    error: result.error,
    data: result.data 
  }
}

export async function deleteProductAttributeValuesRelFromDrizzle(
  relationId: string
): Promise<boolean> {
  const result = await productAttributeValuesRelService.unlink(relationId)
  return result.success
}

export async function deleteProductAttributeValuesRelByAttributeAndValue(
  attributeId: string,
  valueId: string
): Promise<boolean> {
  try {
    // Find the relation by attribute_id + value_id
    const relations = await fetchProductAttributeValuesRelFromDrizzle(attributeId, valueId)
    const targetRelation = relations.find(
      r => r.attribute_id === attributeId && r.value_id === valueId
    )
    
    if (targetRelation) {
      return await deleteProductAttributeValuesRelFromDrizzle(targetRelation.id)
    }
    
    return true // Already doesn't exist
  } catch {
    return false
  }
}

/**
 * Check if a relation already exists
 */
export async function checkProductAttributeValuesRelExists(
  attributeId: string,
  valueId: string
): Promise<boolean> {
  const relations = await fetchProductAttributeValuesRelFromDrizzle(attributeId, valueId)
  return relations.some(
    r => r.attribute_id === attributeId && r.value_id === valueId
  )
}
