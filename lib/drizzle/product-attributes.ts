import { db, product_attributes, product_attribute_values, product_attribute_values_rel } from './server'
import { createCrudService } from './base-crud'
import { eq } from 'drizzle-orm'
import type { ProductAttribute, ProductAttributeValue } from './server'
import type { ProductAttributeValuesRel } from '../../drizzle/schema'
import { productAttributeValuesRelService } from './product-attribute-values-rel'

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

// Extended type to include relations with full attribute data
export interface ProductAttributeValueWithRelations extends ProductAttributeValue {
  attribute_ids?: Array<ProductAttribute & {
    rel_id: string  // ID from junction table
    value_id: string
  }>
}

export async function fetchProductAttributeValueFromDrizzle(valueId: string): Promise<ProductAttributeValueWithRelations | null> {
  console.log('[API] Fetching product attribute value:', { valueId })
  
  const value = await productAttributeValueService.read(valueId)
  if (!value) {
    console.log('[API] Attribute value not found:', { valueId })
    return null
  }

  // Fetch related attribute_ids from junction table using base CRUD
  console.log('[API] Fetching relations from junction table:', { valueId })
  const relations = await productAttributeValuesRelService.search(
    eq(product_attribute_values_rel.value_id, valueId)
  )
  
  console.log('[API] Raw relations found:', { 
    valueId, 
    relationCount: relations.length,
    relations: relations.map((r: ProductAttributeValuesRel) => ({ rel_id: r.id, attribute_id: r.attribute_id }))
  })

  // Fetch full attribute data for each relation
  const attributeIds = relations.map((r: ProductAttributeValuesRel) => r.attribute_id)
  let fullAttributes: ProductAttribute[] = []
  
  if (attributeIds.length > 0) {
    console.log('[API] Fetching full attribute data:', { attributeIds })
    // Fetch all related attributes
    const attributes = await Promise.all(
      attributeIds.map(id => productAttributeService.read(id))
    )
    fullAttributes = attributes.filter((a): a is ProductAttribute => a !== null)
    console.log('[API] Full attributes fetched:', { 
      requestedCount: attributeIds.length,
      foundCount: fullAttributes.length,
      attributes: fullAttributes.map(a => ({ id: a.id, name: a.name, type: a.type }))
    })
  }

  // Merge relation data with full attribute data
  const result = {
    ...value,
    attribute_ids: relations.map((r: ProductAttributeValuesRel) => {
      const fullAttr = fullAttributes.find(a => a.id === r.attribute_id)
      return {
        ...fullAttr,
        rel_id: r.id,  // Keep junction table ID for updates
        value_id: r.value_id
      }
    }).filter((item): item is ProductAttribute & { rel_id: string; value_id: string } => !!item.id)
  }
  
  console.log('[API] Final response with full attributes:', { 
    valueId, 
    hasAttributeIds: !!result.attribute_ids,
    attributeIdsCount: result.attribute_ids?.length,
    sampleAttribute: result.attribute_ids?.[0] ? {
      id: result.attribute_ids[0].id,
      name: result.attribute_ids[0].name,
      type: result.attribute_ids[0].type,
      rel_id: result.attribute_ids[0].rel_id
    } : null
  })

  return result
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

// Update many2many relations with full attribute data
export async function updateProductAttributeValueRelations(
  valueId: string,
  attributes: Array<ProductAttribute & { rel_id?: string; _isNew?: boolean; _toDelete?: boolean }>,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  console.log('[API] Updating attribute value relations:', { valueId, attributeCount: attributes.length })
  
  try {
    // 1. Handle deletions (mark _toDelete)
    const toDelete = attributes.filter(a => a._toDelete && a.rel_id)
    for (const attr of toDelete) {
      console.log('[API] Deleting relation:', { relId: attr.rel_id })
      await productAttributeValuesRelService.unlink(attr.rel_id!)
    }
    
    // 2. Handle new additions (mark _isNew)
    const toAdd = attributes.filter(a => a._isNew && !a._toDelete)
    for (const attr of toAdd) {
      console.log('[API] Creating new relation:', { valueId, attributeId: attr.id })
      await productAttributeValuesRelService.create({
        value_id: valueId,
        attribute_id: attr.id
      } as any, userId)
    }
    
    // 3. Handle updates to existing attributes (type, position, etc.)
    const toUpdate = attributes.filter(a => !a._isNew && !a._toDelete && a.rel_id)
    for (const attr of toUpdate) {
      console.log('[API] Updating related attribute:', { 
        attributeId: attr.id, 
        type: attr.type, 
        position: attr.position 
      })
      
      // Update the actual attribute record
      await productAttributeService.write(attr.id, {
        type: attr.type,
        position: attr.position
      } as any, userId)
    }
    
    console.log('[API] Relations updated successfully:', { valueId })
    return { success: true }
  } catch (error) {
    console.error('[API] Failed to update relations:', error)
    return { success: false, error: String(error) }
  }
}
