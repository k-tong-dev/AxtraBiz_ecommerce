import { createCrudService } from './base-orm/base-crud'
import { invoices, Invoice } from '@/lib/drizzle/schema'

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
