import { NextResponse } from 'next/server'
import { db, audit_logs } from '@/lib/drizzle/server'
import { eq } from 'drizzle-orm'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const [log] = await db.select().from(audit_logs).where(eq(audit_logs.id, Number(id))).limit(1)
    if (!log) return NextResponse.json({ error: 'Audit log not found' }, { status: 404 })
    return NextResponse.json(log)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch audit log' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const [deleted] = await db.delete(audit_logs).where(eq(audit_logs.id, Number(id))).returning()
    if (!deleted) return NextResponse.json({ error: 'Audit log not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: deleted })
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
