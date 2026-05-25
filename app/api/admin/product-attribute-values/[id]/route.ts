import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/utils/supabase/current-user'
import {
  fetchProductAttributeValueFromDrizzle,
  upsertProductAttributeValueInDrizzle,
  deleteProductAttributeValueFromDrizzle,
} from '../../../../../lib/drizzle/product-attributes'

function processScalarFields(body: Record<string, unknown>, id: string) {
  const processedBody: Record<string, unknown> = { id }

  for (const [key, value] of Object.entries(body)) {
    if (key === 'id' || key === 'attribute_ids') continue

    if (['position'].includes(key)) {
      processedBody[key] =
        typeof value === 'string' || typeof value === 'number' ? parseInt(String(value), 10) : 0
    } else if (['active'].includes(key)) {
      processedBody[key] = value !== undefined ? value === 'true' || value === true : true
    } else if (['name', 'value', 'attribute_id'].includes(key)) {
      processedBody[key] = value || ''
    } else {
      processedBody[key] = value !== undefined && value !== null ? value : null
    }
  }

  return processedBody
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const value = await fetchProductAttributeValueFromDrizzle(id)
    if (!value) {
      return NextResponse.json({ error: 'Attribute value not found' }, { status: 404 })
    }
    return NextResponse.json(value)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attribute value' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const userId = await getCurrentUserId()

    const processedBody = processScalarFields(body, id)

    // If attribute_id was provided, include it directly (now a direct FK)
    if (body.attribute_id) {
      processedBody.attribute_id = body.attribute_id
    }

    const result = await upsertProductAttributeValueInDrizzle(processedBody as any, userId)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    const saved = await fetchProductAttributeValueFromDrizzle(id)
    return NextResponse.json({ success: true, data: saved ?? processedBody })
  } catch (error) {
    console.error('[PUT product-attribute-values] Error:', error)
    return NextResponse.json({ error: 'Failed to update attribute value' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await deleteProductAttributeValueFromDrizzle(id)

    if (result) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Failed to delete attribute value' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete attribute value' }, { status: 500 })
  }
}
