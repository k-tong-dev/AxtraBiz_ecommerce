import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/drizzle/server'
import { products } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

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

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1)

    if (!product || product.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product[0])
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

    // Fetch current product to compare changes
    const currentProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1)

    if (!currentProduct || currentProduct.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const current = currentProduct[0]
    
    // Dynamic field processing - automatically handle all fields
    const updateData: any = {
      updated_at: new Date().toISOString()
    }
    
    // Process each field in the body dynamically
    for (const [key, value] of Object.entries(body)) {
      // Skip internal fields
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
      
      // Only include if value changed
      if (value !== undefined && value !== null && processedValue !== (current as any)[key]) {
        updateData[key] = processedValue
      }
    }
    
    // If no fields changed (except updated_at), skip the update
    if (Object.keys(updateData).length > 1) {
      const updatedProduct = await db
        .update(products)
        .set(updateData)
        .where(eq(products.id, productId))
        .returning()

      if (!updatedProduct || updatedProduct.length === 0) {
        return NextResponse.json(
          { error: 'Product not found or update failed' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: updatedProduct[0]
      })
    } else {
      return NextResponse.json({
        success: true,
        message: 'No fields changed'
      })
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

    // Delete the product
    const deletedProduct = await db
      .delete(products)
      .where(eq(products.id, productId))
      .returning()

    if (!deletedProduct || deletedProduct.length === 0) {
      return NextResponse.json(
        { error: 'Product not found or delete failed' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
