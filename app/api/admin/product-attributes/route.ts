import { NextResponse } from 'next/server'
import {
  fetchProductAttributesFromDrizzle,
  fetchProductAttributeFromDrizzle,
  upsertProductAttributeInDrizzle,
  deleteProductAttributeFromDrizzle
} from '../../../../lib/drizzle/product-attributes'
import type { ProductAttribute } from '../../../../lib/drizzle/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  try {
    const allAttributes = await fetchProductAttributesFromDrizzle()
    return NextResponse.json(allAttributes)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product attributes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Get current user from Supabase
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    console.log('[POST] Current user:', user?.id)

    const body = await request.json()
    console.log('[POST] Request body:', body)

    const processedBody: any = {}

    for (const [key, value] of Object.entries(body)) {
      if (key === 'id') continue

      if (['position'].includes(key)) {
        processedBody[key] = typeof value === 'string' || typeof value === 'number' ? parseInt(String(value)) : 0
      }
      else if (['name', 'type'].includes(key)) {
        processedBody[key] = value || ''
      }
      else {
        processedBody[key] = value !== undefined && value !== null ? value : null
      }
    }

    if (!body.id) {
      // CREATE mode
      processedBody.id = crypto.randomUUID()
      console.log('[POST] Creating with:', processedBody)

      // Pass userId to base CRUD for automatic tracking
      const result = await upsertProductAttributeInDrizzle(processedBody, user?.id)
      console.log('[POST] Create result:', result)

      if (result.success) {
        return NextResponse.json({ success: true, data: result.data }, { status: 201 })
      } else {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }
    } else {
      // UPDATE mode via POST
      processedBody.id = body.id
      console.log('[POST] Updating with:', processedBody)

      // Pass userId to base CRUD for automatic tracking
      const result = await upsertProductAttributeInDrizzle(processedBody, user?.id)
      console.log('[POST] Update result:', result)

      if (result.success) {
        return NextResponse.json({ success: true, data: processedBody })
      } else {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }
    }
  } catch (error) {
    console.error('Product Attribute API Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
