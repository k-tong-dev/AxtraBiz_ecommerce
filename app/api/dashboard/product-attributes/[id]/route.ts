import { NextResponse } from 'next/server'
import {
  fetchProductAttributeWithValueIdsFromDrizzle,
  productAttributeService,
  deleteProductAttributeFromDrizzle,
  updateProductAttributeValueRelationsForAttribute,
} from '@/lib/drizzle/queries/product-attributes'
import { eq } from 'drizzle-orm'
import { product_attributes_rel, product_template, product_variants, product_attributes, product_attribute_values } from '@/drizzle/schema'
import { db } from '@/lib/drizzle/server'
import { calculateVariants, compareVariants, Attribute, AttributeValue } from '@/lib/utils/variant-calculator'
import { getCurrentUserId } from '@/utils/supabase/current-user'

/**
 * Cascade delete: Remove variants that depend on this attribute
 */
async function cascadeDeleteAttributeVariants(attributeId: string) {
  try {
    // Find all products that use this attribute
    const productRelations = await db
      .select()
      .from(product_attributes_rel)
      .where(eq(product_attributes_rel.attribute_id, Number(attributeId)))
    
    for (const relation of productRelations) {
      const productId = relation.product_id
      
      // Get all attributes for this product
      const allRelations = await db
        .select()
        .from(product_attributes_rel)
        .where(eq(product_attributes_rel.product_id, productId))
      
      const remainingAttributeIds = allRelations
        .filter(r => r.attribute_id !== Number(attributeId))
        .map(r => r.attribute_id)
      
      // If no attributes left, delete all variants
      if (remainingAttributeIds.length === 0) {
        await db
          .delete(product_variants)
          .where(eq(product_variants.product_id, productId))
      } else {
        // Recalculate variants without the deleted attribute
        const attributes: Attribute[] = []
        
        for (const attrId of remainingAttributeIds) {
          const [attrData] = await db
            .select()
            .from(product_attributes)
            .where(eq(product_attributes.id, attrId))
          
          if (!attrData) continue
          
          const values = await db
            .select()
            .from(product_attribute_values)
            .where(eq(product_attribute_values.attribute_id, attrId))
          
          attributes.push({
            id: attrData.id,
            name: attrData.name,
            type: attrData.type,
            values: values.map(v => ({
              id: v.id,
              attribute_id: v.attribute_id,
              name: v.name,
              value: v.value,
              position: v.position
            }))
          })
        }
        
        // Calculate new variants
        const calculatedVariants = calculateVariants(attributes)
        
        // Fetch existing variants
        const existingVariants = await db
          .select()
          .from(product_variants)
          .where(eq(product_variants.product_id, productId))
        
        // Compare and determine changes
        const { toAdd, toUpdate, toRemove } = compareVariants(
          existingVariants.map(v => ({
            id: v.id,
            name: v.name,
            attributes: v.attributes as Record<string, string>,
            sku: v.sku,
            barcode: v.barcode,
            price: v.price,
            compare_price: v.compare_price,
            cost_price: v.cost_price,
            stock: v.stock,
            weight: v.weight,
            active: v.active
          })),
          calculatedVariants
        )
        
        // Remove obsolete variants
        for (const variant of toRemove) {
          if (variant.id) {
            await db
              .delete(product_variants)
              .where(eq(product_variants.id, variant.id))
          }
        }
        
        // Add new variants
        for (const variant of toAdd) {
          await db.insert(product_variants).values({
            product_id: productId,
            name: variant.name,
            attributes: variant.attributes,
            sku: variant.sku || '',
            barcode: variant.barcode || '',
            price: variant.price || '0',
            compare_price: variant.compare_price || '0',
            cost_price: variant.cost_price || '0',
            stock: variant.stock || 0,
            weight: variant.weight || '0',
            image_ids: '[]',
            position: 0,
            active: variant.active !== false
          })
        }
        
        // Update existing variants
        for (const variant of toUpdate) {
          if (variant.id) {
            await db
              .update(product_variants)
              .set({
                name: variant.name,
                attributes: variant.attributes
              })
              .where(eq(product_variants.id, variant.id))
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in cascade delete:', error)
    throw error
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const attribute = await fetchProductAttributeWithValueIdsFromDrizzle(id)
    if (!attribute) {
      return NextResponse.json({ error: 'Attribute not found' }, { status: 404 })
    }
    return NextResponse.json(attribute)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attribute' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('[PUT] ID from params:', id)

    // Get current user from Supabase
    const userId = await getCurrentUserId()
    console.log('[PUT] Current user:', userId)

    const body = await request.json()
    console.log('[PUT] Request body:', body)

    const valueIds = Array.isArray(body.value_ids) ? body.value_ids : undefined

    const processedBody: any = { id }

    for (const [key, value] of Object.entries(body)) {
      if (key === 'id' || key === 'value_ids') continue

      if (['position'].includes(key)) {
        processedBody[key] = typeof value === 'string' || typeof value === 'number' ? parseInt(String(value)) : 0
      }
      else if (['name', 'type'].includes(key)) {
        processedBody[key] = value || ''
      }
      else {
        processedBody[key] = value !== undefined && value !== null ? value : null
      }
    }

    console.log('[PUT] Processed body:', processedBody)

    const result = await productAttributeService.write(id, processedBody, userId)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    if (valueIds !== undefined) {
      const relResult = await updateProductAttributeValueRelationsForAttribute(id, valueIds, userId)
      if (!relResult.success) {
        return NextResponse.json({ error: relResult.error }, { status: 400 })
      }
    }

    const saved = await fetchProductAttributeWithValueIdsFromDrizzle(id)
    return NextResponse.json({ success: true, data: saved ?? processedBody })
  } catch (error) {
    console.error('[PUT] Error:', error)
    return NextResponse.json({ error: 'Failed to update attribute' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Cascade delete: recalculate variants for products using this attribute
    await cascadeDeleteAttributeVariants(id)
    
    const result = await deleteProductAttributeFromDrizzle(id)
    
    if (result) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Failed to delete attribute' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete attribute' }, { status: 500 })
  }
}
