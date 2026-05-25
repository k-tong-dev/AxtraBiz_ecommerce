import { NextResponse } from 'next/server'
import {
  fetchCategoriesFromDrizzle,
  upsertCategoryInDrizzle,
  deleteCategoryFromDrizzle
} from '@/lib/drizzle/categories'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  try {
    const all = await fetchCategoriesFromDrizzle()
    return NextResponse.json(all)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await request.json()
    const items = Array.isArray(body) ? body : [body]

    const results: any[] = []
    for (const item of items) {
      const r = await upsertCategoryInDrizzle(item, user?.id)
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
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    const result = await deleteCategoryFromDrizzle(id)

    if (result) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to delete category'
      }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
