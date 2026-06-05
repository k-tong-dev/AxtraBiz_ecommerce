import { NextResponse } from 'next/server'
import {
  fetchProductAttributesFromDrizzle,
  fetchProductAttributeFromDrizzle,
  productAttributeService,
  deleteProductAttributeFromDrizzle
} from '@/lib/drizzle/queries/product-attributes'
// import type { ProductAttribute } from '../../../../lib/drizzle/server'
import { getCurrentUserId } from '@/utils/supabase/current-user'

export async function GET() {
  try {
    const allAttributes = await fetchProductAttributesFromDrizzle()
    return NextResponse.json(allAttributes)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product attributes' }, { status: 500 })
  }
}

function processAttributeFields(raw: Record<string, any>): Record<string, any> {
  const out: any = {}
  for (const [key, value] of Object.entries(raw)) {
    if (key === 'id') continue
    if (['position'].includes(key)) {
      out[key] = typeof value === 'string' || typeof value === 'number' ? parseInt(String(value)) : 0
    } else if (['name', 'type'].includes(key)) {
      out[key] = value || ''
    } else {
      out[key] = value !== undefined && value !== null ? value : null
    }
  }
  return out
}

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId()

    const body = await request.json()
    const items = Array.isArray(body) ? body : [body]

    const results: any[] = []
    for (const raw of items) {
      const processed = processAttributeFields(raw)
      if (raw.id) processed.id = raw.id

      const result = await productAttributeService.upsert(processed as any, userId)
      if (!result.success) {
        return NextResponse.json({ error: result.error, index: results.length }, { status: 400 })
      }
      results.push(result.data ?? processed)
    }

    return NextResponse.json(
      { success: true, data: Array.isArray(body) ? results : results[0] },
      { status: 201 }
    )
  } catch (error) {
    console.error('Product Attribute API Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
