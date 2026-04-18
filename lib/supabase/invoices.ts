import type { Invoice } from '@/lib/types'
import { getSupabaseClient } from './client'

function toStringOrUndefined(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined
  return String(value)
}

function toNumberOrUndefined(value: unknown): number | undefined {
  if (value === null || value === undefined) return undefined
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : undefined
}

function mapInvoiceRow(row: Record<string, unknown>): Invoice | null {
  const id = toStringOrUndefined(row.id) ?? toStringOrUndefined(row.invoice_id)
  const orderId =
    toStringOrUndefined(row.orderId) ??
    toStringOrUndefined(row.order_id) ??
    toStringOrUndefined(row.order)
  const customerId =
    toStringOrUndefined(row.customerId) ??
    toStringOrUndefined(row.customer_id) ??
    toStringOrUndefined(row.user_id)

  const total = toNumberOrUndefined(row.total) ?? toNumberOrUndefined(row.amount) ?? toNumberOrUndefined(row.total_amount)
  const statusRaw = toStringOrUndefined(row.status) ?? toStringOrUndefined(row.invoice_status)
  const status = (statusRaw as Invoice['status'] | undefined) ?? 'draft'
  const createdAt =
    toStringOrUndefined(row.createdAt) ?? toStringOrUndefined(row.created_at) ?? new Date().toISOString()
  const dueDate = toStringOrUndefined(row.dueDate) ?? toStringOrUndefined(row.due_date) ?? undefined

  if (!id || !orderId || !customerId || total === undefined) return null

  return { id, orderId, customerId, total, status, createdAt, dueDate }
}

export async function fetchInvoicesFromSupabase(): Promise<Invoice[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  try {
    const { data, error } = await supabase.from('invoices').select('*')
    if (error || !data) return []

    const mapped = (data as Record<string, unknown>[]).map((row) => mapInvoiceRow(row)).filter(Boolean) as Invoice[]
    return mapped
  } catch {
    return []
  }
}

export async function upsertInvoiceInSupabase(invoice: Partial<Invoice> & { id: string }): Promise<boolean> {
  const supabase = getSupabaseClient()
  if (!supabase) return false

  try {
    await supabase.from('invoices').upsert(invoice as any, { onConflict: 'id' })
    return true
  } catch {
    return false
  }
}

export async function deleteInvoiceFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  if (!supabase) return false

  try {
    const { error } = await supabase.from('invoices').delete().eq('id', id)
    return !error
  } catch {
    return false
  }
}

