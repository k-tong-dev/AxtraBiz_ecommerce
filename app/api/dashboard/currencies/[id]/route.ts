import { NextResponse } from 'next/server'
import { db, currencies } from '@/lib/drizzle/server'
import { eq } from 'drizzle-orm'
import { getCurrentUserId } from '@/lib/utils/current-user'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const [item] = await db.select().from(currencies).where(eq(currencies.code, id)).limit(1)
    if (!item) return NextResponse.json({ error: 'Currency not found' }, { status: 404 })
    return NextResponse.json(item)
  } catch { return NextResponse.json({ error: 'Failed to fetch currency' }, { status: 500 }) }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const now = new Date().toISOString()
    const [updated] = await db.update(currencies).set({ ...body, updated_at: now }).where(eq(currencies.code, id)).returning()
    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.delete(currencies).where(eq(currencies.code, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
