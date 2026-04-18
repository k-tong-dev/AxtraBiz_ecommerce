import { NextResponse } from 'next/server'
import { db, invoices } from '../../../lib/drizzle/server'
import { eq } from 'drizzle-orm'
import type { Invoice } from '../../../lib/drizzle/server'

export async function GET() {
  try {
    const allInvoices = await db.select().from(invoices)
    return NextResponse.json(allInvoices)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, ...invoiceData } = body
    
    if (id) {
      // Update existing invoice
      await db
        .update(invoices)
        .set(invoiceData as any)
        .where(eq(invoices.id, id))
    } else {
      // Insert new invoice
      await db.insert(invoices).values(invoiceData as any)
    }
    
    return NextResponse.json({ success: true })
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
    
    await db.delete(invoices).where(eq(invoices.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
