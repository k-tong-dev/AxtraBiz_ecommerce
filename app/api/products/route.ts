import { NextResponse } from 'next/server'
import {
  fetchProductsFromDrizzle,
  upsertProductInDrizzle
} from '../../../lib/drizzle/products'
import type { Product } from '../../../lib/drizzle/server'

export async function GET() {
  try {
    const allProducts = await fetchProductsFromDrizzle()
    return NextResponse.json(allProducts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
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
    const processedBody: any = {}
    
    // Process each field in the body dynamically
    for (const [key, value] of Object.entries(body)) {
      // Skip internal fields
      if (key === 'id') continue
      
      // Handle date fields
      if (key.includes('date') || key.includes('published_at') || key.includes('created_at') || key.includes('updated_at')) {
        processedBody[key] = formatDate(value)
      }
      // Handle numeric fields
      else if (['price', 'compare_price', 'cost_price', 'weight', 'rating'].includes(key)) {
        processedBody[key] = typeof value === 'string' || typeof value === 'number' ? parseFloat(String(value)) : 0
      }
      else if (['stock', 'reviews', 'low_stock_threshold'].includes(key)) {
        processedBody[key] = typeof value === 'string' || typeof value === 'number' ? parseInt(String(value)) : 0
      }
      // Handle boolean fields
      else if (['active', 'track_inventory', 'allow_backorders'].includes(key)) {
        processedBody[key] = value !== undefined ? (value === 'true' || value === true) : true
      }
      // Handle array/json fields
      else if (['tags', 'features', 'image_ids'].includes(key)) {
        processedBody[key] = Array.isArray(value) ? value : (typeof value === 'string' ? value.split(',').map((t: string) => t.trim()) : [])
      }
      // Handle text fields with defaults
      else if (['barcode', 'slug', 'description', 'name'].includes(key)) {
        processedBody[key] = value || ''
      }
      // Handle other fields (FKs, status, type, etc.)
      else {
        processedBody[key] = value !== undefined && value !== null ? value : null
      }
    }
    
    // Check if this is a new product (no ID) or update (has ID)
    if (!body.id) {
      // Insert new product
      processedBody.id = crypto.randomUUID()
      const result = await upsertProductInDrizzle(processedBody)
      
      if (result.success) {
        return NextResponse.json({ success: true, data: processedBody }, { status: 201 })
      } else {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }
    } else {
      // Update existing product
      const result = await upsertProductInDrizzle(processedBody)
      
      if (result.success) {
        return NextResponse.json({ success: true, data: processedBody })
      } else {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }
    }
  } catch (error) {
    console.error('Product API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
