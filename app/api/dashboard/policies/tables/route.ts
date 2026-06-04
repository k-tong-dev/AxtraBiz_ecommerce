import { NextResponse } from 'next/server'
import { fetchTables } from '@/lib/drizzle/policies'

export async function GET() {
  try {
    const tables = await fetchTables()
    return NextResponse.json(tables)
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to fetch tables'
    }, { status: 500 })
  }
}
