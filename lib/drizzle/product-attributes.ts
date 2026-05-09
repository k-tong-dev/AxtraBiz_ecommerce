import { db, product_attributes, product_attribute_values } from './server'
import { createCrudService } from './base-crud'
import { eq } from 'drizzle-orm'
import type { ProductAttribute, ProductAttributeValue } from './server'

// Create CRUD service for product attributes
export const productAttributeService = createCrudService<ProductAttribute, any, any>(
  product_attributes
)

// Create CRUD service for product attribute values
export const productAttributeValueService = createCrudService<ProductAttributeValue, any, any>(
  product_attribute_values
)

// Convenience functions for product attributes
export async function fetchProductAttributesFromDrizzle(): Promise<ProductAttribute[]> {
  return productAttributeService.search()
}

export async function fetchProductAttributeFromDrizzle(attributeId: string): Promise<ProductAttribute | null> {
  return productAttributeService.read(attributeId)
}

export async function upsertProductAttributeInDrizzle(attribute: ProductAttribute, userId?: string): Promise<{ success: boolean; error?: string; data?: any }> {
  const result = await productAttributeService.upsert(attribute, userId)
  return { success: result.success, error: result.error, data: result.data }
}

export async function deleteProductAttributeFromDrizzle(attributeId: string): Promise<boolean> {
  const result = await productAttributeService.unlink(attributeId)
  return result.success
}

// Convenience functions for product attribute values
export async function fetchProductAttributeValuesFromDrizzle(attributeId?: string): Promise<ProductAttributeValue[]> {
  if (attributeId) {
    return productAttributeValueService.search(eq(product_attribute_values, attributeId))
  }
  return productAttributeValueService.search()
}

export async function fetchProductAttributeValueFromDrizzle(valueId: string): Promise<ProductAttributeValue | null> {
  return productAttributeValueService.read(valueId)
}

export async function upsertProductAttributeValueInDrizzle(value: ProductAttributeValue, userId?: string): Promise<{ success: boolean; error?: string; data?: any }> {
  const result = await productAttributeValueService.upsert(value, userId)
  return { success: result.success, error: result.error, data: result.data }
}

export async function deleteProductAttributeValueFromDrizzle(valueId: string): Promise<boolean> {
  const result = await productAttributeValueService.unlink(valueId)
  return result.success
}

// Batch delete attribute values by attribute_id
export async function deleteProductAttributeValuesByAttributeId(attributeId: string): Promise<boolean> {
  try {
    const values = await fetchProductAttributeValuesFromDrizzle(attributeId)
    const results = await Promise.all(values.map(v => productAttributeValueService.unlink(v.id)))
    return results.every(r => r.success)
  } catch {
    return false
  }
}
