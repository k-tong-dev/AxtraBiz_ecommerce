import { NextResponse } from 'next/server'
import {
  fetchBrandsFromDrizzle,
  upsertBrandInDrizzle,
  deleteBrandFromDrizzle
} from '@/lib/drizzle/brands'

export async function GET() {
  try {
    const all = await fetchBrandsFromDrizzle()
    return NextResponse.json(all)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const items = Array.isArray(body) ? body : [body]

    const results: any[] = []
    for (const item of items) {
      if (!item.id) item.id = crypto.randomUUID()
      if (!item.slug) item.slug = item.name?.toLowerCase().replace(/\s+/g, '-')
      // FormView sends logo_id as array; db expects single value
      if (Array.isArray(item.logo_id)) item.logo_id = item.logo_id[0] || null
      const r = await upsertBrandInDrizzle(item)
      if (!r.success) {
        return NextResponse.json({ success: false, error: r.error, index: results.length }, { status: 400 })
      }
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
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Brand ID is required' }, { status: 400 })
    }

    const result = await deleteBrandFromDrizzle(id)

    if (result) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to delete brand'
      }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
