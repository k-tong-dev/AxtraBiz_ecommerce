import { NextResponse } from 'next/server'
import { fetchPolicies } from '@/lib/drizzle/queries/policies'

export async function GET() {
  try {
    const policies = await fetchPolicies()
    return NextResponse.json(policies)
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to fetch policies'
    }, { status: 500 })
  }
}
