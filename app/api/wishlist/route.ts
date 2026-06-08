import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/drizzle/queries/users'
import { db, wishlist_items } from '@/lib/drizzle/server'
import { eq, and } from 'drizzle-orm'

export async function GET() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) return NextResponse.json({ items: [], isGuest: true })

    const rows = await db
      .select({ productId: wishlist_items.product_id })
      .from(wishlist_items)
      .where(eq(wishlist_items.user_id, userId))
      .orderBy(wishlist_items.created_at)

    return NextResponse.json({ items: rows.map(r => r.productId), isGuest: false })
  } catch {
    return NextResponse.json({ items: [], isGuest: true })
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { product_id, variant_id } = body

    if (!product_id) {
      return NextResponse.json({ error: 'product_id is required' }, { status: 400 })
    }

    const existing = await db
      .select()
      .from(wishlist_items)
      .where(and(eq(wishlist_items.user_id, userId), eq(wishlist_items.product_id, product_id)))
      .limit(1)

    if (existing.length > 0) {
      await db.delete(wishlist_items).where(eq(wishlist_items.id, existing[0].id))
      return NextResponse.json({ success: true, inWishlist: false })
    }

    const [created] = await db
      .insert(wishlist_items)
      .values({ user_id: userId, product_id, variant_id: variant_id || null })
      .returning()

    return NextResponse.json({ success: true, inWishlist: true, data: created })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const url = new URL(request.url)
    const productId = url.searchParams.get('product_id')

    if (!productId) {
      return NextResponse.json({ error: 'product_id is required' }, { status: 400 })
    }

    await db
      .delete(wishlist_items)
      .where(and(eq(wishlist_items.user_id, userId), eq(wishlist_items.product_id, Number(productId))))

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
