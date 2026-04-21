import { NextResponse } from 'next/server'
import { db, products } from '../../../lib/drizzle/server'
import { eq } from 'drizzle-orm'
import type { Product } from '../../../lib/drizzle/server'

export async function GET() {
  try {
    const allProducts = await db.select().from(products)
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
      const newProduct = {
        ...processedBody,
        id: crypto.randomUUID(), // Generate new ID for database
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      await db.insert(products).values(newProduct as any)
    } else {
      // Update existing product - partial update (only changed fields)
      const { id, ...productData } = processedBody
      
      // Fetch current product to compare changes
      const currentProduct = await db
        .select()
        .from(products)
        .where(eq(products.id, id))
        .limit(1)
      
      if (!currentProduct || currentProduct.length === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
      
      const current = currentProduct[0]
      const updateData: any = {
        updated_at: new Date().toISOString()
      }
      
      // Only include fields that actually changed
      for (const [key, value] of Object.entries(productData)) {
        if (value !== undefined && value !== null && value !== (current as any)[key]) {
          updateData[key] = value
        }
      }
      
      // If no fields changed (except updated_at), skip the update
      if (Object.keys(updateData).length > 1) {
        await db
          .update(products)
          .set(updateData as any)
          .where(eq(products.id, id))
      }
    }
    
    const response = { success: true, data: processedBody }
    return NextResponse.json(response)
  } catch (error) {
    console.error('Product API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
