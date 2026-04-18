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
    console.log('POST /api/products body:', body)
    
    // Check if this is a new product (no ID) or update (has ID)
    if (!body.id) {
      console.log('Creating new product')
      // Insert new product
      const newProduct = {
        ...body,
        id: crypto.randomUUID() // Generate new ID for database
      }
      await db.insert(products).values(newProduct as any)
    } else {
      console.log('Updating existing product with ID:', body.id)
      // Update existing product
      const { id, ...productData } = body
      await db
        .update(products)
        .set(productData as any)
        .where(eq(products.id, id))
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Product API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
