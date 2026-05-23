import { NextResponse } from 'next/server'
import {
  fetchBrandFromDrizzle,
  upsertBrandInDrizzle,
  deleteBrandFromDrizzle
} from '@/lib/drizzle/brands'
import type { Brand } from '@/lib/drizzle/server'

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
    const brandData: Brand = { ...body, id } as Brand
    if (!brandData.slug) brandData.slug = brandData.name?.toLowerCase().replace(/\s+/g, '-')
    if (Array.isArray(brandData.logo_id)) brandData.logo_id = brandData.logo_id[0] || null
    const result = await upsertBrandInDrizzle(brandData)

    if (result.success) {
      return NextResponse.json({ success: true, data: result.data })
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
