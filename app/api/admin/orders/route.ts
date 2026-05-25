import { NextResponse } from 'next/server'
import {
  fetchOrdersFromDrizzle,
  upsertOrderInDrizzle,
  deleteOrderFromDrizzle
} from '../../../../lib/drizzle/orders'
import type { Order } from '../../../../lib/drizzle/server'

export async function GET() {
  try {
    const allOrders = await fetchOrdersFromDrizzle()
    return NextResponse.json(allOrders)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const result = await upsertOrderInDrizzle(body)
    
    if (result.success) {
      return NextResponse.json({ success: true, data: body })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 400 })
    }
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
    
    const result = await deleteOrderFromDrizzle(id)
    
    if (result) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to delete order'
      }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
