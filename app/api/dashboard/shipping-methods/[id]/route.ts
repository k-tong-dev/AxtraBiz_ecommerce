import { NextResponse } from 'next/server'
import {
  fetchShippingMethodFromDrizzle,
  shippingMethodService,
  deleteShippingMethodFromDrizzle
} from '@/lib/drizzle/queries/shipping_methods'
import { getCurrentUserId } from '@/lib/drizzle/queries/users'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const shippingMethod = await fetchShippingMethodFromDrizzle(id)
    if (!shippingMethod) {
      return NextResponse.json({ error: 'Shipping method not found' }, { status: 404 })
    }
    return NextResponse.json(shippingMethod)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shipping method' }, { status: 500 })
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

    const result = await shippingMethodService.write(id, processedData, userId)

    if (result.success) {
      const updated = await fetchShippingMethodFromDrizzle(id)
      return NextResponse.json({ success: true, data: updated })
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await deleteShippingMethodFromDrizzle(id)

    if (result) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to delete shipping method'
      }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
