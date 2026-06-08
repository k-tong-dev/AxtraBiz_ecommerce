import { NextResponse } from 'next/server'
import {
  fetchShippingZoneFromDrizzle,
  shippingZoneService,
  deleteShippingZoneFromDrizzle
} from '@/lib/drizzle/queries/shipping_zones'
import { getCurrentUserId } from '@/lib/utils/current-user'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const zone = await fetchShippingZoneFromDrizzle(id)
    if (!zone) {
      return NextResponse.json({ error: 'Shipping zone not found' }, { status: 404 })
    }
    return NextResponse.json(zone)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shipping zone' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const userId = await getCurrentUserId()
    const processedData: any = { ...body, id }
    const result = await shippingZoneService.write(id, processedData, userId)
    if (result.success) {
      const updated = await fetchShippingZoneFromDrizzle(id)
      return NextResponse.json({ success: true, data: updated })
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
