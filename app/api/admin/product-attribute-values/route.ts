import { NextResponse } from 'next/server'
import {
  fetchProductAttributeValuesFromDrizzle,
  fetchProductAttributeValueFromDrizzle,
  upsertProductAttributeValueInDrizzle,
  deleteProductAttributeValueFromDrizzle
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const processedBody: any = {}
    
    for (const [key, value] of Object.entries(body)) {
      if (key === 'id') continue
      
      if (['position'].includes(key)) {
        processedBody[key] = typeof value === 'string' || typeof value === 'number' ? parseInt(String(value)) : 0
      }
      else if (['active'].includes(key)) {
        processedBody[key] = value !== undefined ? (value === 'true' || value === true) : true
      }
      else if (['name', 'value', 'attribute_id'].includes(key)) {
        processedBody[key] = value || ''
      }
      else {
        processedBody[key] = value !== undefined && value !== null ? value : null
      }
    }
    
    if (!body.id) {
      processedBody.id = crypto.randomUUID()
      const result = await upsertProductAttributeValueInDrizzle(processedBody)
      
      if (result.success) {
        return NextResponse.json({ success: true, data: result.data }, { status: 201 })
      } else {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }
    } else {
      const result = await upsertProductAttributeValueInDrizzle(processedBody)
      
      if (result.success) {
        return NextResponse.json({ success: true, data: processedBody })
      } else {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }
    }
  } catch (error) {
    console.error('Product Attribute Value API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
