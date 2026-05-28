import { db, invoices } from '../drizzle/server'
import { createCrudService } from './base-crud'
import type { Invoice } from '../drizzle/server'

// Create CRUD service for invoices
export const invoiceService = createCrudService<Invoice, any, any>(
  invoices
)

// Convenience functions that match the old API
export async function fetchInvoicesFromDrizzle(): Promise<Invoice[]> {
  return invoiceService.search()
}

export async function fetchInvoiceFromDrizzle(invoiceId: string): Promise<Invoice | null> {
  return invoiceService.read(invoiceId)
}

export async function upsertInvoiceInDrizzle(invoice: Invoice, userId?: string): Promise<{ success: boolean; data?: any; error?: string }> {
  const result = await invoiceService.upsert(invoice, userId)
  return { success: result.success, data: result.data, error: result.error }
}

export async function deleteInvoiceFromDrizzle(invoiceId: string): Promise<boolean> {
  const result = await invoiceService.unlink(invoiceId)
  return result.success
}
