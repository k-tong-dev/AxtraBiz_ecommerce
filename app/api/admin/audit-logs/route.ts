import { NextResponse } from 'next/server'
import { db, audit_logs } from '@/lib/drizzle/server'
import { desc, eq, and } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number(searchParams.get('limit')) || 100, 500)
    const offset = Number(searchParams.get('offset')) || 0
    const action = searchParams.get('action')
    const entityType = searchParams.get('entity_type')
    const severity = searchParams.get('severity')
    const userId = searchParams.get('user_id')

    const filters: any[] = []
    if (action) filters.push(eq(audit_logs.action, action))
    if (entityType) filters.push(eq(audit_logs.entity_type, entityType))
    if (severity) filters.push(eq(audit_logs.severity, severity))
    if (userId) filters.push(eq(audit_logs.user_id, userId))

    const query = filters.length > 0
      ? db.select().from(audit_logs).where(and(...filters)).orderBy(desc(audit_logs.created_at)).limit(limit).offset(offset)
      : db.select().from(audit_logs).orderBy(desc(audit_logs.created_at)).limit(limit).offset(offset)

    const all = await query
    return NextResponse.json({ data: all, total: all.length })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.action || !body.entity_type) {
      return NextResponse.json({ error: 'action and entity_type are required' }, { status: 400 })
    }
    const [created] = await db.insert(audit_logs).values({
      user_id: body.user_id || null,
      action: body.action,
      entity_type: body.entity_type,
      entity_id: body.entity_id || null,
      details: body.details || {},
      ip_address: body.ip_address || null,
      user_agent: body.user_agent || null,
      severity: body.severity || 'info',
    }).returning()
    return NextResponse.json({ success: true, data: created })
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
