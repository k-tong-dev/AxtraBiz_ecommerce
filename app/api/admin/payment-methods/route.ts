import { NextResponse } from 'next/server'
import {
  fetchPaymentMethodsFromDrizzle,
  paymentMethodService,
  deletePaymentMethodFromDrizzle
} from '@/lib/drizzle/payment_methods'

export async function GET() {
  try {
    const all = await fetchPaymentMethodsFromDrizzle()
    return NextResponse.json(all)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payment methods' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const items = Array.isArray(body) ? body : [body]

    const results: any[] = []
    for (const item of items) {
      const r = await paymentMethodService.upsert(item)
      if (!r.success) {
        return NextResponse.json({ success: false, error: r.error, index: results.length }, { status: 400 })
      }
      results.push(r.data ?? item)
    }

    return NextResponse.json(
      { success: true, data: Array.isArray(body) ? results : results[0] },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Payment method ID is required' }, { status: 400 })
    }

    const result = await deletePaymentMethodFromDrizzle(id)

    if (result) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to delete payment method'
      }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
