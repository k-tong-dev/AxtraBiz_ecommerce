import { NextResponse } from 'next/server'
import {
  fetchPagesFromDrizzle,
  pageService,
  deletePageFromDrizzle
} from '@/lib/drizzle/pages'

export async function GET() {
  try {
    const all = await fetchPagesFromDrizzle()
    return NextResponse.json(all)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const items = Array.isArray(body) ? body : [body]

    const results: any[] = []
    for (const item of items) {
      const r = await pageService.upsert(item)
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
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
    }

    const result = await deletePageFromDrizzle(id)

    if (result) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to delete page'
      }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
