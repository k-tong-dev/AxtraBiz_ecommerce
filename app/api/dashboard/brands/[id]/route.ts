import { NextResponse } from 'next/server'
import {
  fetchBrandFromDrizzle,
  brandService,
  deleteBrandFromDrizzle
} from '@/lib/drizzle/queries/brands'
import { getCurrentUserId } from '@/lib/drizzle/queries/users'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const brand = await fetchBrandFromDrizzle(id)
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }
    return NextResponse.json(brand)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch brand' }, { status: 500 })
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

    const processedData: any = { ...body, id }
    if (!processedData.slug) processedData.slug = processedData.name?.toLowerCase().replace(/\s+/g, '-')
    if (typeof processedData.image_id === 'string') {
      try { processedData.image_id = JSON.parse(processedData.image_id) } catch {}
    }

    const result = await brandService.write(id, processedData, userId)

    if (result.success) {
      const updated = await fetchBrandFromDrizzle(id)
      return NextResponse.json({ success: true, data: updated })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await deleteBrandFromDrizzle(id)

    if (result) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to delete brand'
      }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
