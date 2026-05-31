import { NextResponse } from 'next/server'
import {
  fetchWishlistItemFromDrizzle,
  wishlistItemService,
  deleteWishlistItemFromDrizzle
} from '@/lib/drizzle/wishlist_items'
import { getCurrentUserId } from '@/utils/supabase/current-user'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const item = await fetchWishlistItemFromDrizzle(id)
    if (!item) {
      return NextResponse.json({ error: 'Wishlist item not found' }, { status: 404 })
    }
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wishlist item' }, { status: 500 })
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

    const result = await wishlistItemService.write(id, body, userId)

    if (result.success) {
      const updated = await fetchWishlistItemFromDrizzle(id)
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
    const result = await deleteWishlistItemFromDrizzle(id)

    if (result) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: 'Failed to delete wishlist item' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
