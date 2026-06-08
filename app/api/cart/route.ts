import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/drizzle/queries/users'
import { db } from '@/lib/drizzle/server'
import { cart_items, product_template } from '@/lib/drizzle/schema'
import { eq, and } from 'drizzle-orm'

export async function GET() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) return NextResponse.json({ items: [], isGuest: true })

    const rows = await db
      .select({
        id: cart_items.id,
        productId: cart_items.product_id,
        variantId: cart_items.variant_id,
        quantity: cart_items.quantity,
        price: product_template.price,
      })
      .from(cart_items)
      .leftJoin(product_template, eq(cart_items.product_id, product_template.id))
      .where(eq(cart_items.user_id, userId))
      .orderBy(cart_items.created_at)

    return NextResponse.json({ items: rows, isGuest: false })
  } catch {
    return NextResponse.json({ items: [], isGuest: true })
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { product_id, variant_id, quantity, mode } = body

    if (!product_id || quantity == null) {
      return NextResponse.json({ error: 'product_id and quantity are required' }, { status: 400 })
    }

    const existing = await db
      .select()
      .from(cart_items)
      .where(and(eq(cart_items.user_id, userId), eq(cart_items.product_id, product_id)))
      .limit(1)

    if (existing.length > 0) {
      const newQuantity = mode === 'set' ? quantity : existing[0].quantity + quantity
      const updated = await db
        .update(cart_items)
        .set({ quantity: Math.max(0, newQuantity), updated_at: new Date().toISOString() })
        .where(eq(cart_items.id, existing[0].id))
        .returning()
      return NextResponse.json({ success: true, data: updated[0] })
    }

    const [created] = await db
      .insert(cart_items)
      .values({
        user_id: userId,
        product_id,
        variant_id: variant_id || null,
        quantity,
      })
      .returning()

    return NextResponse.json({ success: true, data: created })
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

    const existing = await db
      .select()
      .from(cart_items)
      .where(and(eq(cart_items.user_id, userId), eq(cart_items.product_id, Number(productId))))
      .limit(1)

    if (existing.length > 0) {
      await db.delete(cart_items).where(eq(cart_items.id, existing[0].id))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
