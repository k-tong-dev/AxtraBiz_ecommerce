import { NextResponse } from 'next/server'
import {
  fetchTaxRateFromDrizzle,
  taxRateService,
  deleteTaxRateFromDrizzle
} from '@/lib/drizzle/queries/tax_rates'
import { getCurrentUserId } from '@/lib/utils/current-user'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const taxRate = await fetchTaxRateFromDrizzle(id)
    if (!taxRate) {
      return NextResponse.json({ error: 'Tax rate not found' }, { status: 404 })
    }
    return NextResponse.json(taxRate)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tax rate' }, { status: 500 })
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
    const result = await taxRateService.write(id, processedData, userId)
    if (result.success) {
      const updated = await fetchTaxRateFromDrizzle(id)
      return NextResponse.json({ success: true, data: updated })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
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
    const result = await deleteTaxRateFromDrizzle(id)
    if (result) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: 'Failed to delete tax rate' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
