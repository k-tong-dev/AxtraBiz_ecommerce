import { NextResponse } from 'next/server'
import { 
  fetchProductAttributeValuesRelFromDrizzle,
  upsertProductAttributeValuesRelInDrizzle,
  deleteProductAttributeValuesRelFromDrizzle,
  deleteProductAttributeValuesRelByAttributeAndValue,
  checkProductAttributeValuesRelExists
} from '@/lib/drizzle/product-attribute-values-rel'

/**
 * GET - Fetch product attribute value relations
 * Query params:
 *   - attribute_id: Get all value relations for an attribute
 *   - value_id: Get all attribute relations for a value
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const attributeId = searchParams.get('attribute_id')
    const valueId = searchParams.get('value_id')

    const relations = await fetchProductAttributeValuesRelFromDrizzle(
      attributeId || undefined,
      valueId || undefined
    )

    return NextResponse.json(relations)
  } catch (error) {
    console.error('[GET /api/admin/product-attribute-values-rel] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attribute value relations' },
      { status: 500 }
    )
  }
}

/**
 * POST - Create or update a junction record
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.attribute_id || !body.value_id) {
      return NextResponse.json(
        { error: 'attribute_id and value_id are required' },
        { status: 400 }
      )
    }

    // Check if relation already exists
    const exists = await checkProductAttributeValuesRelExists(
      body.attribute_id,
      body.value_id
    )

    if (exists) {
      // Find existing relation to update
      const relations = await fetchProductAttributeValuesRelFromDrizzle(
        body.attribute_id,
        body.value_id
      )
      const existing = relations[0]
      
      if (existing) {
        const result = await upsertProductAttributeValuesRelInDrizzle({
          ...existing,
          position: body.position ?? existing.position,
          updated_at: new Date().toISOString()
        })
        
        if (result.success) {
          return NextResponse.json({ success: true, data: result.data })
        } else {
          return NextResponse.json(
            { error: result.error || 'Failed to update relation' },
            { status: 500 }
          )
        }
      }
    }

    // Create new relation
    const result = await upsertProductAttributeValuesRelInDrizzle({
      id: body.id || crypto.randomUUID(),
      attribute_id: body.attribute_id,
      value_id: body.value_id,
      position: body.position ?? 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    if (result.success) {
      return NextResponse.json({ success: true, data: result.data }, { status: 201 })
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to create relation' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[POST /api/admin/product-attribute-values-rel] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save relation' },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Remove a junction record
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const attributeId = searchParams.get('attribute_id')
    const valueId = searchParams.get('value_id')

    if (id) {
      // Delete by ID
      const success = await deleteProductAttributeValuesRelFromDrizzle(id)
      
      if (success) {
        return NextResponse.json({ success: true, message: 'Relation deleted' })
      } else {
        return NextResponse.json(
          { error: 'Failed to delete relation' },
          { status: 500 }
        )
      }
    }

    if (attributeId && valueId) {
      // Delete by attribute_id + value_id
      const success = await deleteProductAttributeValuesRelByAttributeAndValue(
        attributeId,
        valueId
      )
      
      if (success) {
        return NextResponse.json({ success: true, message: 'Relation deleted' })
      } else {
        return NextResponse.json(
          { error: 'Failed to delete relation' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'id or (attribute_id + value_id) required' },
      { status: 400 }
    )
  } catch (error) {
    console.error('[DELETE /api/admin/product-attribute-values-rel] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete relation' },
      { status: 500 }
    )
  }
}
