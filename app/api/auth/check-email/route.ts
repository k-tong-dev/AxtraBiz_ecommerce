import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/drizzle/client'
import { resUsers } from '@/lib/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  try {
    const [user] = await db.select({ id: resUsers.id })
      .from(resUsers)
      .where(eq(resUsers.email, email))
      .limit(1)

    return NextResponse.json({ exists: !!user })
  } catch (e) {
    console.error('[check-email] query failed:', (e as Error).message)
    return NextResponse.json({ exists: false })
  }
}
