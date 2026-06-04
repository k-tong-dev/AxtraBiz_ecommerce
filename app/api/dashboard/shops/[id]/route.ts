import { NextResponse } from 'next/server'
import { fetchShopFromDrizzle, shopService, deleteShopFromDrizzle } from '@/lib/drizzle/shops'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const shop = await fetchShopFromDrizzle(id)
    if (!shop) return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
    return NextResponse.json(shop)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shop' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const processedData: any = { ...body, id }
    if (!processedData.slug) processedData.slug = processedData.name?.toLowerCase().replace(/\s+/g, '-')
    if (typeof processedData.logo === 'string') { try { processedData.logo = JSON.parse(processedData.logo) } catch {} }
    if (typeof processedData.address === 'string') { try { processedData.address = JSON.parse(processedData.address) } catch {} }

    const result = await shopService.write(id, processedData)
    if (result.success) {
      const updated = await fetchShopFromDrizzle(id)
      return NextResponse.json({ success: true, data: updated })
    }
    return NextResponse.json({ success: false, error: result.error }, { status: 400 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const result = await deleteShopFromDrizzle(id)
    return result
      ? NextResponse.json({ success: true })
      : NextResponse.json({ success: false, error: 'Failed to delete shop' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
