import { db, invoices } from '../drizzle/server'
import { eq } from 'drizzle-orm'
import type { Invoice } from '../drizzle/server'

export async function fetchInvoicesFromDrizzle(): Promise<Invoice[]> {
  try {
    const allInvoices = await db.select().from(invoices)
    return allInvoices
  } catch {
    return []
  }
}

export async function fetchInvoiceFromDrizzle(invoiceId: string): Promise<Invoice | null> {
  try {
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, invoiceId))
      .limit(1)
    
    return invoice || null
  } catch {
    return null
  }
}

export async function upsertInvoiceInDrizzle(invoice: Invoice): Promise<{ success: boolean; error?: string }> {
  try {
    const existingInvoice = await fetchInvoiceFromDrizzle(invoice.id)
    
    if (existingInvoice) {
      // Update existing invoice
      await db
        .update(invoices)
        .set(invoice as any)
        .where(eq(invoices.id, invoice.id))
    } else {
      // Insert new invoice
      await db.insert(invoices).values(invoice as any)
    }
    
    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }
}

export async function deleteInvoiceFromDrizzle(invoiceId: string): Promise<boolean> {
  try {
    await db.delete(invoices).where(eq(invoices.id, invoiceId))
    return true
  } catch {
    return false
  }
}
