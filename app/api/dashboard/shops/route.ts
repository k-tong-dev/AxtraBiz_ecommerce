import { NextResponse } from 'next/server'
import { fetchShopsFromDrizzle, shopService, deleteShopFromDrizzle } from '@/lib/drizzle/shops'

export async function GET() {
  try {
    const all = await fetchShopsFromDrizzle()
    return NextResponse.json(all)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shops' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const items = Array.isArray(body) ? body : [body]
    const results: any[] = []

    for (const item of items) {
      if (!item.slug) item.slug = item.name?.toLowerCase().replace(/\s+/g, '-')
      if (typeof item.logo === 'string') { try { item.logo = JSON.parse(item.logo) } catch {} }
      if (typeof item.address === 'string') { try { item.address = JSON.parse(item.address) } catch {} }
      const r = await shopService.upsert(item)
      if (!r.success) return NextResponse.json({ success: false, error: r.error }, { status: 400 })
      results.push(r.data ?? item)
    }

    return NextResponse.json(
      { success: true, data: Array.isArray(body) ? results : results[0] },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Shop ID is required' }, { status: 400 })

    const result = await deleteShopFromDrizzle(id)
    return result
      ? NextResponse.json({ success: true })
      : NextResponse.json({ success: false, error: 'Failed to delete shop' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
