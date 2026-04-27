import { NextRequest, NextResponse } from 'next/server'
import { productService } from '@/lib/drizzle/products'
import { eq } from 'drizzle-orm'
import { products } from '@/drizzle/schema'

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

    const product = await productService.read(productId)

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
    const updateData: any = {}
    
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
      
      updateData[key] = processedValue
    }
    
    const result = await productService.write(productId, updateData)

    if (result.success) {
      const updatedProduct = await productService.read(productId)
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

    const result = await productService.unlink(productId)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Product deleted successfully'
      })
    } else {
      return NextResponse.json(
        { error: result.error },
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
