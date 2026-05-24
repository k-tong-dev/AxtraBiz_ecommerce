import { NextResponse } from 'next/server'
import {
  fetchProductsFromDrizzle,
  upsertProductInDrizzle
} from '../../../lib/drizzle/products'
import type { ProductTemplate } from '../../../lib/drizzle/server'

export async function GET() {
  try {
    const allProducts = await fetchProductsFromDrizzle()
    return NextResponse.json(allProducts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// Shared field-processing logic for a single product
function processProductFields(raw: Record<string, any>): Record<string, any> {
  const formatDate = (dateValue: any): string | null => {
    if (!dateValue) return null
    if (dateValue instanceof Date) return dateValue.toISOString()
    if (typeof dateValue === 'string') {
      const parsed = new Date(dateValue)
      if (!isNaN(parsed.getTime())) return parsed.toISOString()
    }
    return null
  }

  const out: any = {}
  for (const [key, value] of Object.entries(raw)) {
    if (key === 'id') continue
    if (key.includes('date') || key.includes('published_at') || key.includes('created_at') || key.includes('updated_at')) {
      out[key] = formatDate(value)
    } else if (['price', 'compare_price', 'cost_price', 'weight', 'rating'].includes(key)) {
      out[key] = typeof value === 'string' || typeof value === 'number' ? parseFloat(String(value)) : 0
    } else if (['stock', 'reviews', 'low_stock_threshold'].includes(key)) {
      out[key] = typeof value === 'string' || typeof value === 'number' ? parseInt(String(value)) : 0
    } else if (['active', 'track_inventory', 'allow_backorders'].includes(key)) {
      out[key] = value !== undefined ? (value === 'true' || value === true) : true
    } else if (['tags', 'features', 'image_ids'].includes(key)) {
      out[key] = Array.isArray(value) ? value : (typeof value === 'string' ? value.split(',').map((t: string) => t.trim()) : [])
    } else if (['barcode', 'slug', 'description', 'name'].includes(key)) {
      out[key] = value || ''
    } else {
      out[key] = value !== undefined && value !== null ? value : null
    }
  }
  return out
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const items = Array.isArray(body) ? body : [body]

    const results: any[] = []
    for (const raw of items) {
      const processed = processProductFields(raw)
      if (!raw.id) processed.id = crypto.randomUUID()
      const result = await upsertProductInDrizzle(processed as any)
      if (!result.success) {
        return NextResponse.json({ error: result.error, index: results.length }, { status: 400 })
      }
      results.push(processed)
    }

    return NextResponse.json(
      { success: true, data: Array.isArray(body) ? results : results[0] },
      { status: 201 }
    )
  } catch (error) {
    console.error('Product API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
