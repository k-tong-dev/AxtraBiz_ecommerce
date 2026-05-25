import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import {
  fetchProductAttributeValuesFromDrizzle,
  fetchProductAttributeValueFromDrizzle,
  upsertProductAttributeValueInDrizzle,
  deleteProductAttributeValueFromDrizzle,
} from '../../../../lib/drizzle/product-attributes'
import type { ProductAttributeValue } from '../../../../lib/drizzle/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const attributeId = searchParams.get('attribute_id')
    
    if (attributeId) {
      const values = await fetchProductAttributeValuesFromDrizzle(attributeId)
      return NextResponse.json(values)
    }
    
    const allValues = await fetchProductAttributeValuesFromDrizzle()
    return NextResponse.json(allValues)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product attribute values' }, { status: 500 })
  }
}

function processAttributeValueFields(raw: Record<string, any>): Record<string, any> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(raw)) {
    if (key === 'id' || key === 'attribute_ids') continue
    if (['position'].includes(key)) {
      out[key] = typeof value === 'string' || typeof value === 'number' ? parseInt(String(value)) : 0
    } else if (['active'].includes(key)) {
      out[key] = value !== undefined ? (value === 'true' || value === true) : true
    } else if (['name', 'value', 'attribute_id'].includes(key)) {
      out[key] = value || ''
    } else {
      out[key] = value !== undefined && value !== null ? value : null
    }
  }
  return out
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await request.json()
    const items = Array.isArray(body) ? body : [body]

    const results: any[] = []
    for (const raw of items) {
      const processed = processAttributeValueFields(raw)
      const id = raw.id || crypto.randomUUID()

      // Include attribute_id directly if provided (now a direct FK)
      if (raw.attribute_id) {
        processed.attribute_id = raw.attribute_id
      }

      const result = await upsertProductAttributeValueInDrizzle({ ...processed, id } as ProductAttributeValue, user?.id)
      if (!result.success) {
        return NextResponse.json({ error: result.error, index: results.length }, { status: 400 })
      }

      const saved = await fetchProductAttributeValueFromDrizzle(id)
      results.push(saved ?? result.data ?? processed)
    }

    return NextResponse.json(
      { success: true, data: Array.isArray(body) ? results : results[0] },
      { status: 201 }
    )
  } catch (error) {
    console.error('Product Attribute Value API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
