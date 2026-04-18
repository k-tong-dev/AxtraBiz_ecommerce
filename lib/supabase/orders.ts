import type { Order, OrderItem, ShippingAddress } from '@/lib/types'
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

function mapShippingAddress(raw: unknown): ShippingAddress | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>

  const name = toStringOrUndefined(r.name) ?? 'Customer'
  const email = toStringOrUndefined(r.email) ?? 'customer@example.com'
  const phone = toStringOrUndefined(r.phone) ?? ''
  const address = toStringOrUndefined(r.address) ?? ''
  const city = toStringOrUndefined(r.city) ?? ''
  const state = toStringOrUndefined(r.state) ?? ''
  const zipCode = toStringOrUndefined(r.zipCode) ?? toStringOrUndefined(r.zip_code) ?? ''
  const country = toStringOrUndefined(r.country) ?? 'USA'

  if (!address || !city) return null

  return {
    name,
    email,
    phone,
    address,
    city,
    state,
    zipCode,
    country,
  }
}

function mapOrderItem(raw: unknown): OrderItem | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>

  const productId = toStringOrUndefined(r.productId) ?? toStringOrUndefined(r.product_id)
  const productName = toStringOrUndefined(r.productName) ?? toStringOrUndefined(r.product_name)
  const price = toNumberOrUndefined(r.price) ?? toNumberOrUndefined(r.unit_price)
  const quantity = toNumberOrUndefined(r.quantity) ?? toNumberOrUndefined(r.qty)

  if (!productId || !productName || price === undefined || quantity === undefined) return null

  return { productId, productName, price, quantity }
}

function mapOrderRow(row: Record<string, unknown>): Order | null {
  const id = toStringOrUndefined(row.id) ?? toStringOrUndefined(row.order_id)
  const userId = toStringOrUndefined(row.userId) ?? toStringOrUndefined(row.user_id)
  const totalPrice =
    toNumberOrUndefined(row.totalPrice) ?? toNumberOrUndefined(row.total_price) ?? toNumberOrUndefined(row.total)
  const status = (toStringOrUndefined(row.status) as Order['status'] | undefined) ?? 'pending'
  const createdAt = toStringOrUndefined(row.createdAt) ?? toStringOrUndefined(row.created_at) ?? new Date().toISOString()
  const trackingNumber =
    toStringOrUndefined(row.trackingNumber) ?? toStringOrUndefined(row.tracking_number) ?? undefined

  const shippingAddress = mapShippingAddress(row.shippingAddress ?? row.shipping_address)

  const itemsRaw = row.items ?? row.order_items
  const items =
    Array.isArray(itemsRaw) ? itemsRaw.map((x) => mapOrderItem(x)).filter(Boolean) : []

  if (!id || !userId || !shippingAddress) return null
  if (!items.length) {
    // Still allow display/edit even if items aren’t returned.
  }

  if (totalPrice === undefined) return null

  return {
    id,
    userId,
    items: items.length ? items : [],
    shippingAddress,
    totalPrice,
    status,
    createdAt,
    trackingNumber,
  }
}

export async function fetchOrdersFromSupabase(): Promise<Order[]> {
  const supabase = getSupabaseClient()
  if (!supabase) return []

  try {
    const { data, error } = await supabase.from('orders').select('*')
    if (error || !data) return []

    const mapped = (data as Record<string, unknown>[])
      .map((row) => mapOrderRow(row))
      .filter(Boolean) as Order[]

    return mapped
  } catch {
    return []
  }
}

export async function upsertOrderInSupabase(order: Partial<Order> & { id: string }): Promise<boolean> {
  const supabase = getSupabaseClient()
  if (!supabase) return false

  try {
    await supabase.from('orders').upsert(order as any, { onConflict: 'id' })
    return true
  } catch {
    return false
  }
}

export async function deleteOrderFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  if (!supabase) return false

  try {
    const { error } = await supabase.from('orders').delete().eq('id', id)
    return !error
  } catch {
    return false
  }
}

