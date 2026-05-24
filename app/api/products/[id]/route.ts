import { NextRequest, NextResponse } from 'next/server'
import {
  fetchProductFromDrizzle,
  upsertProductInDrizzle,
  deleteProductFromDrizzle
} from '@/lib/drizzle/products'
import { eq } from 'drizzle-orm'
import { product_template, product_variants, product_attributes, product_attribute_values } from '@/drizzle/schema'
import { db } from '@/lib/drizzle/server'
import { calculateVariants, compareVariants, Attribute, AttributeValue } from '@/lib/utils/variant-calculator'

/**
 * Generate variants for a product based on its attributes
 */
async function generateVariantsForProduct(productId: string, attributeIds: string[]) {
  try {
    // Fetch attributes and their values
    const attributes: Attribute[] = []
    
    for (const attrId of attributeIds) {
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
        id: crypto.randomUUID(),
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
  } catch (error) {
    console.error('Error generating variants:', error)
    throw error
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const product = await fetchProductFromDrizzle(productId)

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
    const body = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!body.name || body.name.trim() === '') {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      )
    }

    // Convert date fields to ISO strings
    const formatDate = (dateValue: any): string | null => {
      if (!dateValue) return null
      if (dateValue instanceof Date) return dateValue.toISOString()
      if (typeof dateValue === 'string') {
        const parsed = new Date(dateValue)
        if (!isNaN(parsed.getTime())) return parsed.toISOString()
      }
      return null
    }

    // Dynamic field processing - automatically handle all fields
    const updateData: any = {
      id: productId  // Always include the ID from URL params
    }
    
    // Process each field in the body dynamically
    for (const [key, value] of Object.entries(body)) {
      // Skip internal fields and id (already set from URL params)
      if (key === 'id') continue
      
      // Process field value
      let processedValue: any
      // Handle date fields
      if (key.includes('date') || key.includes('published_at') || key.includes('created_at')) {
        processedValue = formatDate(value)
      }
      // Handle numeric fields
      else if (['price', 'compare_price', 'cost_price', 'weight', 'rating'].includes(key)) {
        processedValue = typeof value === 'string' || typeof value === 'number' ? parseFloat(String(value)) : 0
      }
      else if (['stock', 'reviews', 'low_stock_threshold'].includes(key)) {
        processedValue = typeof value === 'string' || typeof value === 'number' ? parseInt(String(value)) : 0
      }
      // Handle boolean fields
      else if (['active', 'track_inventory', 'allow_backorders'].includes(key)) {
        processedValue = value !== undefined ? (value === 'true' || value === true) : true
      }
      // Handle array/json fields
      else if (['tags', 'features', 'image_ids'].includes(key)) {
        processedValue = Array.isArray(value) ? value : (typeof value === 'string' ? value.split(',').map((t: string) => t.trim()) : [])
      }
      // Handle text fields with defaults
      else if (['barcode', 'slug', 'description', 'name'].includes(key)) {
        processedValue = value || ''
      }
      // Handle other fields (FKs, status, type, etc.)
      else {
        processedValue = value !== undefined && value !== null ? value : null
      }
      
      updateData[key] = processedValue
    }
    
    const result = await upsertProductInDrizzle(updateData)

    if (result.success) {
      // Handle variant generation for variable products
      if (body.product_type === 'variable' && body.attribute_ids) {
        await generateVariantsForProduct(productId, body.attribute_ids)
      }

      const updatedProduct = await fetchProductFromDrizzle(productId)
      return NextResponse.json({
        success: true,
        data: updatedProduct
      })
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const result = await deleteProductFromDrizzle(productId)

    if (result) {
      return NextResponse.json({
        success: true,
        message: 'Product deleted successfully'
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
