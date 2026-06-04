import { NextResponse } from 'next/server'
import {
  fetchShippingZonesFromDrizzle,
  shippingZoneService,
  deleteShippingZoneFromDrizzle
} from '@/lib/drizzle/shipping_zones'

export async function GET() {
  try {
    const all = await fetchShippingZonesFromDrizzle()
    return NextResponse.json(all)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shipping zones' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await shippingZoneService.upsert(body)
    if (result.success) {
      return NextResponse.json({ success: true, data: result.data })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
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
      return NextResponse.json({ error: 'Shipping zone ID is required' }, { status: 400 })
    }
    const result = await deleteShippingZoneFromDrizzle(id)
    if (result) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: 'Failed to delete shipping zone' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
