import { NextResponse } from 'next/server'
import { fetchCountries } from '@/lib/drizzle/queries/countries'

export async function GET() {
  try {
    const data = await fetchCountries()
    return NextResponse.json({ data })
  } catch (e) {
    console.error('[countries] fetch failed:', (e as Error).message)
    return NextResponse.json({ data: [], error: 'Failed to load countries' }, { status: 500 })
  }
}
