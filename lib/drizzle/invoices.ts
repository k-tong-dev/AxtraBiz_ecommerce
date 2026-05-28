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

export async function deleteInvoiceFromDrizzle(invoiceId: string): Promise<boolean> {
  const result = await invoiceService.unlink(invoiceId)
  return result.success
}
