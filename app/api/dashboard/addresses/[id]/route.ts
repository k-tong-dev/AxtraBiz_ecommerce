import { NextResponse } from 'next/server'
import {
  fetchResUserAddressFromDrizzle,
  resUserAddressService,
  deleteResUserAddressFromDrizzle
} from '@/lib/drizzle/res-user-addresses'
import { getCurrentUserId } from '@/utils/supabase/current-user'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const address = await fetchResUserAddressFromDrizzle(id)
    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }
    return NextResponse.json(address)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch address' }, { status: 500 })
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

    const result = await resUserAddressService.write(id, processedData, userId)

    if (result.success) {
      const updated = await fetchResUserAddressFromDrizzle(id)
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
    const result = await deleteResUserAddressFromDrizzle(id)

    if (result) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to delete address'
      }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
