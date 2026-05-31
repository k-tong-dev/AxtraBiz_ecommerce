import { NextResponse } from 'next/server'
import { db, currencies } from '@/lib/drizzle/server'

export async function GET() {
  try {
    const all = await db.select().from(currencies).orderBy(currencies.code)
    return NextResponse.json(all)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch currencies' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.code) return NextResponse.json({ error: 'Currency code is required' }, { status: 400 })
    const [created] = await db.insert(currencies).values(body).onConflictDoNothing().returning()
    return NextResponse.json({ success: true, data: created || body })
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' }, { status: 500 })
  }
}
