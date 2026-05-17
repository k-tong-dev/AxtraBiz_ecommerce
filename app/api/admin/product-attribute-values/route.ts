import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import {
  fetchProductAttributeValuesFromDrizzle,
  fetchProductAttributeValueFromDrizzle,
  upsertProductAttributeValueInDrizzle,
  deleteProductAttributeValueFromDrizzle,
  updateProductAttributeValueRelations,
} from '../../../../lib/drizzle/product-attributes'
import type { ProductAttribute, ProductAttributeValue } from '../../../../lib/drizzle/server'

type AttributeRelationPayload = ProductAttribute & {
  rel_id?: string
  attribute_id?: string
  isNew?: boolean
  isChanged?: boolean
  _toDelete?: boolean
}

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

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const attributeIds = Array.isArray(body.attribute_ids)
      ? (body.attribute_ids as AttributeRelationPayload[])
      : undefined

    const processedBody: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(body)) {
      if (key === 'id' || key === 'attribute_ids') continue

      if (['position'].includes(key)) {
        processedBody[key] = typeof value === 'string' || typeof value === 'number' ? parseInt(String(value)) : 0
      }
      else if (['active'].includes(key)) {
        processedBody[key] = value !== undefined ? (value === 'true' || value === true) : true
      }
      else if (['name', 'value'].includes(key)) {
        processedBody[key] = value || ''
      }
      else {
        processedBody[key] = value !== undefined && value !== null ? value : null
      }
    }

    if (!body.id) {
      processedBody.id = crypto.randomUUID()
    }

    const valueId = (body.id as string) || (processedBody.id as string)
    const result = await upsertProductAttributeValueInDrizzle(processedBody as ProductAttributeValue, user?.id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    if (attributeIds?.length) {
      const relResult = await updateProductAttributeValueRelations(valueId, attributeIds, user?.id)
      if (!relResult.success) {
        return NextResponse.json({ error: relResult.error }, { status: 400 })
      }
    }

    const saved = await fetchProductAttributeValueFromDrizzle(valueId)
    return NextResponse.json(
      { success: true, data: saved ?? result.data ?? processedBody },
      { status: body.id ? 200 : 201 }
    )
  } catch (error) {
    console.error('Product Attribute Value API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
