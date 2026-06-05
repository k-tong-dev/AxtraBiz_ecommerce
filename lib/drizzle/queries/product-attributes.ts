import { db, product_attributes, product_attribute_values } from '../server'
import { createCrudService } from './base-crud'
import { eq, sql } from 'drizzle-orm'
import type { ProductAttribute, ProductAttributeValue } from '@/lib/drizzle/schema'

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

export async function fetchProductAttributeFromDrizzle(attributeId: string | number): Promise<ProductAttribute | null> {
  return productAttributeService.read(attributeId)
}

export async function deleteProductAttributeFromDrizzle(attributeId: string | number): Promise<boolean> {
  const result = await productAttributeService.unlink(attributeId)
  return result.success
}

// Enriched fetch for product attributes that includes one2many value_ids
export interface ProductAttributeWithValues extends ProductAttribute {
  value_ids?: Array<{
    id: number
    attribute_id: number | null
    position: number
    name: string
    value: string
    active: boolean
    isNew?: boolean
    _toDelete?: boolean
    isChanged?: boolean
  }>
}

export async function fetchProductAttributeWithValueIdsFromDrizzle(attributeId: string | number): Promise<ProductAttributeWithValues | null> {
  const attribute = await productAttributeService.read(attributeId)
  if (!attribute) return null

  const values = await productAttributeValueService.search(
    eq(product_attribute_values.attribute_id, Number(attributeId))
  )
  return {
    ...attribute,
    value_ids: values.map(v => ({
      ...v,
      position: v.position ?? 0,
    })),
  }
}

// Convenience functions for product attribute values
export async function fetchProductAttributeValuesFromDrizzle(attributeId?: string | number): Promise<ProductAttributeValue[]> {
  if (attributeId) {
    return productAttributeValueService.search(eq(product_attribute_values.attribute_id, Number(attributeId)))
  }
  return productAttributeValueService.search()
}

// Extended type for value data returned to client
export interface ProductAttributeValueWithRelations extends ProductAttributeValue {
  // The attribute_id is now a direct FK on the value, no need for extra relation
}

export async function fetchProductAttributeValueFromDrizzle(valueId: string | number): Promise<ProductAttributeValueWithRelations | null> {
  return await productAttributeValueService.read(valueId)
}

export async function deleteProductAttributeValueFromDrizzle(valueId: string | number): Promise<boolean> {
  const result = await productAttributeValueService.unlink(valueId)
  return result.success
}

// Batch delete attribute values by attribute_id
export async function deleteProductAttributeValuesByAttributeId(attributeId: string | number): Promise<boolean> {
  try {
    const values = await fetchProductAttributeValuesFromDrizzle(attributeId)
    const results = await Promise.all(values.map(v => productAttributeValueService.unlink(v.id)))
    return results.every(r => r.success)
  } catch {
    return false
  }
}

export async function updateProductAttributeValueRelationsForAttribute(
  attributeId: string | number,
  values: Array<{
    id?: number
    attribute_id?: number
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
        eq(product_attribute_values.attribute_id, Number(attributeId))
      )
      const existingIds = new Set(existing.map(v => v.id))

      // Delete values that are no longer selected (actually unlink by nullifying FK)
      for (const val of existing) {
        if (!stringValues.includes(String(val.id))) {
          await productAttributeValueService.upsert({
            id: val.id,
            attribute_id: null,
            name: val.name,
            value: val.value,
            position: val.position ?? 0,
            active: val.active,
          } as ProductAttributeValue, userId)
        }
      }

      // Create values that are new (not in DB)
      for (const valId of stringValues) {
        if (!existingIds.has(Number(valId))) {
          await productAttributeValueService.upsert({
            attribute_id: Number(attributeId),
            name: valId,
            value: valId,
            position: 0,
            active: true,
          } as ProductAttributeValue, userId)
        }
      }
    } else {
      // Widget mode: process items with flags
      const objValues = values as Array<{
        id?: number; _toDelete?: boolean; isNew?: boolean; isChanged?: boolean
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
        } as ProductAttributeValue, userId)
      }

      const toAdd = objValues.filter(v => v.isNew && !v._toDelete)
      for (const val of toAdd) {
        const data: Record<string, any> = {
          attribute_id: attributeId,
          name: val.name || '',
          value: val.value || val.name || '',
          position: val.position ?? 0,
          active: val.active ?? true,
        }
        if (val.id) data.id = val.id
        await productAttributeValueService.upsert(data as ProductAttributeValue, userId)
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
        } as ProductAttributeValue, userId)
      }
    }

    return { success: true }
  } catch (error) {
    console.error('[API] Failed to update attribute value relations:', error)
    return { success: false, error: String(error) }
  }
}
