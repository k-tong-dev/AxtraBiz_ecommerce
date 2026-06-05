import { NextResponse } from 'next/server'
import { fetchOrderFromDrizzle, orderService, deleteOrderFromDrizzle } from '@/lib/drizzle/queries/orders'
import { getCurrentUserId } from '@/utils/supabase/current-user'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const item = await fetchOrderFromDrizzle(id)
    if (!item) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    return NextResponse.json(item)
  } catch { return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 }) }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const userId = await getCurrentUserId()
    const result = await orderService.write(id, { ...body, id }, userId)
    if (result.success) {
      const updated = await fetchOrderFromDrizzle(id)
      return NextResponse.json({ success: true, data: updated })
    }
    return NextResponse.json({ success: false, error: result.error }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const result = await deleteOrderFromDrizzle(id)
    return result ? NextResponse.json({ success: true }) : NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
