import { db, product_attributes, product_attribute_values } from './server'
import { createCrudService } from './base-crud'
import { eq, sql } from 'drizzle-orm'
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

// Enriched fetch for product attributes that includes one2many value_ids
export interface ProductAttributeWithValues extends ProductAttribute {
  value_ids?: Array<{
    id: string
    attribute_id: string | null
    position: number
    name: string
    value: string
    active: boolean
    isNew?: boolean
    _toDelete?: boolean
    isChanged?: boolean
  }>
}

export async function fetchProductAttributeWithValueIdsFromDrizzle(attributeId: string): Promise<ProductAttributeWithValues | null> {
  const attribute = await productAttributeService.read(attributeId)
  if (!attribute) return null

  const values = await productAttributeValueService.search(
    eq(product_attribute_values.attribute_id, attributeId)
  )

  return {
    ...attribute,
    value_ids: values.map(v => ({
      id: v.id,
      attribute_id: v.attribute_id,
      position: v.position ?? 0,
      name: v.name,
      value: v.value,
      active: v.active,
    })),
  }
}

// Convenience functions for product attribute values
export async function fetchProductAttributeValuesFromDrizzle(attributeId?: string): Promise<ProductAttributeValue[]> {
  if (attributeId) {
    return productAttributeValueService.search(eq(product_attribute_values.attribute_id, attributeId))
  }
  return productAttributeValueService.search()
}

// Extended type for value data returned to client
export interface ProductAttributeValueWithRelations extends ProductAttributeValue {
  // The attribute_id is now a direct FK on the value, no need for extra relation
}

export async function fetchProductAttributeValueFromDrizzle(valueId: string): Promise<ProductAttributeValueWithRelations | null> {
  const value = await productAttributeValueService.read(valueId)
  return value
}

export async function upsertProductAttributeValueInDrizzle(
  value: ProductAttributeValue & { attribute_ids?: unknown },
  userId?: string
): Promise<{ success: boolean; error?: string; data?: any }> {
  const { attribute_ids: _attributeIds, ...valueFields } = value as ProductAttributeValue & {
    attribute_ids?: unknown
  }
  const result = await productAttributeValueService.upsert(valueFields as ProductAttributeValue & { id: string }, userId)
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

export async function updateProductAttributeValueRelationsForAttribute(
  attributeId: string,
  values: Array<{
    id?: string
    attribute_id?: string
    position?: number
    name?: string
    value?: string
    active?: boolean
    isNew?: boolean
    _toDelete?: boolean
    isChanged?: boolean
  } | string>,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if values are plain strings (tags mode) or objects with flags (widget mode)
    const isPlainStrings = values.length > 0 && typeof values[0] === 'string'
    const stringValues = values as string[]

    if (isPlainStrings) {
      // Tags mode: diff against existing DB values
      const existing = await productAttributeValueService.search(
        eq(product_attribute_values.attribute_id, attributeId)
      )
      const existingIds = new Set(existing.map(v => v.id))

      // Delete values that are no longer selected (actually unlink by nullifying FK)
      for (const val of existing) {
        if (!stringValues.includes(val.id)) {
          await productAttributeValueService.upsert({
            id: val.id,
            attribute_id: null,
            name: val.name,
            value: val.value,
            position: val.position ?? 0,
            active: val.active,
          } as ProductAttributeValue & { id: string }, userId)
        }
      }

      // Create values that are new (not in DB)
      for (const valId of stringValues) {
        if (!existingIds.has(valId)) {
          await productAttributeValueService.upsert({
            id: valId,
            attribute_id: attributeId,
            name: valId,
            value: valId,
            position: 0,
            active: true,
          } as ProductAttributeValue & { id: string }, userId)
        }
      }
    } else {
      // Widget mode: process items with flags
      const objValues = values as Array<{
        id?: string; _toDelete?: boolean; isNew?: boolean; isChanged?: boolean
        name?: string; value?: string; position?: number; active?: boolean
      }>

      const toDelete = objValues.filter(v => v._toDelete && v.id)
      for (const val of toDelete) {
        await productAttributeValueService.upsert({
          id: val.id,
          attribute_id: null,
          name: val.name || '',
          value: val.value || val.name || '',
          position: val.position ?? 0,
          active: val.active ?? false,
        } as ProductAttributeValue & { id: string }, userId)
      }

      const toAdd = objValues.filter(v => v.isNew && !v._toDelete)
      for (const val of toAdd) {
        const valueId = val.id || crypto.randomUUID()
        await productAttributeValueService.upsert({
          id: valueId,
          attribute_id: attributeId,
          name: val.name || '',
          value: val.value || val.name || '',
          position: val.position ?? 0,
          active: val.active ?? true,
        } as ProductAttributeValue & { id: string }, userId)
      }

      const toUpdate = objValues.filter(v => v.isChanged && !v._toDelete && !v.isNew && v.id)
      for (const val of toUpdate) {
        await productAttributeValueService.upsert({
          id: val.id,
          attribute_id: attributeId,
          name: val.name,
          value: val.value || val.name,
          position: val.position ?? 0,
          active: val.active ?? true,
        } as ProductAttributeValue & { id: string }, userId)
      }
    }

    return { success: true }
  } catch (error) {
    console.error('[API] Failed to update attribute value relations:', error)
    return { success: false, error: String(error) }
  }
}
