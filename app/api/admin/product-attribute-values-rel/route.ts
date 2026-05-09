import { NextResponse } from 'next/server'
import { db } from '@/lib/drizzle/server'
import { product_attribute_values_rel } from '@/drizzle/schema'
import { eq, and } from 'drizzle-orm'

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

    // Build query conditions
    let conditions = []
    if (attributeId) {
      conditions.push(eq(product_attribute_values_rel.attribute_id, attributeId))
    }
    if (valueId) {
      conditions.push(eq(product_attribute_values_rel.value_id, valueId))
    }

    // Fetch relations
    const relations = await db
      .select()
      .from(product_attribute_values_rel)
      .where(conditions.length > 0 ? and(...conditions) : undefined)

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
    const existing = await db
      .select()
      .from(product_attribute_values_rel)
      .where(
        and(
          eq(product_attribute_values_rel.attribute_id, body.attribute_id),
          eq(product_attribute_values_rel.value_id, body.value_id)
        )
      )
      .limit(1)

    if (existing.length > 0) {
      // Update existing
      const [updated] = await db
        .update(product_attribute_values_rel)
        .set({
          position: body.position ?? existing[0].position,
          updated_at: new Date().toISOString()
        })
        .where(eq(product_attribute_values_rel.id, existing[0].id))
        .returning()

      return NextResponse.json({ success: true, data: updated })
    }

    // Create new
    const [created] = await db
      .insert(product_attribute_values_rel)
      .values({
        id: body.id || crypto.randomUUID(),
        attribute_id: body.attribute_id,
        value_id: body.value_id,
        position: body.position ?? 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .returning()

    return NextResponse.json({ success: true, data: created }, { status: 201 })
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
      await db
        .delete(product_attribute_values_rel)
        .where(eq(product_attribute_values_rel.id, id))

      return NextResponse.json({ success: true, message: 'Relation deleted' })
    }

    if (attributeId && valueId) {
      // Delete by attribute_id + value_id
      await db
        .delete(product_attribute_values_rel)
        .where(
          and(
            eq(product_attribute_values_rel.attribute_id, attributeId),
            eq(product_attribute_values_rel.value_id, valueId)
          )
        )

      return NextResponse.json({ success: true, message: 'Relation deleted' })
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
