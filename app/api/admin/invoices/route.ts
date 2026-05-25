import { NextResponse } from 'next/server'
import {
  fetchInvoicesFromDrizzle,
  upsertInvoiceInDrizzle,
  deleteInvoiceFromDrizzle
} from '../../../../lib/drizzle/invoices'
import type { Invoice } from '../../../../lib/drizzle/server'

export async function GET() {
  try {
    const allInvoices = await fetchInvoicesFromDrizzle()
    return NextResponse.json(allInvoices)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const result = await upsertInvoiceInDrizzle(body)
    
    if (result.success) {
      return NextResponse.json({ success: true, data: body })
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

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 })
    }
    
    const result = await deleteInvoiceFromDrizzle(id)
    
    if (result) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to delete invoice'
      }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
