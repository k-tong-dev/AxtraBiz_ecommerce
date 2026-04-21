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
    const processedBody = {
      ...body,
      active: body.active !== undefined ? (body.active === 'true' || body.active === true) : true,
      compare_price: body.compare_price ? parseFloat(body.compare_price) : 0,
      cost_price: body.cost_price ? parseFloat(body.cost_price) : 0,
      price: body.price ? parseFloat(body.price) : 0,
      stock: body.stock ? parseInt(body.stock) : 0,
      reviews: body.reviews ? parseInt(body.reviews) : 0,
      weight: body.weight ? parseFloat(body.weight) : 0,
      barcode: body.barcode || '',
      slug: body.slug || '',
      image_ids: body.image_ids || [],
    }
    
    console.log('Processed body:', JSON.stringify(processedBody, null, 2))
    
    // Check if this is a new product (no ID) or update (has ID)
    if (!body.id) {
      console.log('Creating new product with processed data:', processedBody)
      // Insert new product
      const newProduct = {
        ...processedBody,
        id: crypto.randomUUID(), // Generate new ID for database
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      await db.insert(products).values(newProduct as any)
    } else {
      console.log('Updating existing product with ID:', body.id, 'Data:', processedBody)
      // Update existing product
      const { id, ...productData } = processedBody
      const updateData = {
        ...productData,
        updated_at: new Date().toISOString()
      }
      
      console.log('Update data for database:', JSON.stringify(updateData, null, 2))
      
      const result = await db
        .update(products)
        .set(updateData as any)
        .where(eq(products.id, id))
      
      console.log('Database update result:', result)
    }
    
    const response = { success: true, data: processedBody }
    console.log('=== API RESPONSE ===')
    console.log('Response:', JSON.stringify(response, null, 2))
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Product API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
