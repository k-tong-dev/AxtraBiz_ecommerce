import { NextResponse } from 'next/server'
import { db, orders } from '../../../lib/drizzle/server'
import { eq } from 'drizzle-orm'
import type { Order } from '../../../lib/drizzle/server'

export async function GET() {
  try {
    const allOrders = await db.select().from(orders)
    return NextResponse.json(allOrders)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, ...orderData } = body
    
    if (id) {
      // Update existing order
      await db
        .update(orders)
        .set(orderData as any)
        .where(eq(orders.id, id))
    } else {
      // Insert new order
      await db.insert(orders).values(orderData as any)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }
    
    await db.delete(orders).where(eq(orders.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
