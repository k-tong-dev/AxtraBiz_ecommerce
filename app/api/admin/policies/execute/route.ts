import { NextResponse } from 'next/server'
import { executeSql } from '@/lib/drizzle/policies'

export async function POST(request: Request) {
  try {
    const { sql } = await request.json()
    if (!sql || typeof sql !== 'string') {
      return NextResponse.json({ error: 'SQL statement is required' }, { status: 400 })
    }

    // Only allow DDL/DML statements for security
    const upper = sql.trim().toUpperCase()
    if (!/^(CREATE|ALTER|DROP|GRANT|REVOKE|SELECT|INSERT|UPDATE|DELETE)\s/.test(upper)) {
      return NextResponse.json({ error: 'Only DDL, DML, and DCL statements are allowed' }, { status: 400 })
    }

    await executeSql(sql)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'SQL execution failed'
    }, { status: 500 })
  }
}
