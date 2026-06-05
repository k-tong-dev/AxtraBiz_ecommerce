import { Product, Order, Invoice, Announcement } from "@/drizzle"
import { User } from "@supabase/supabase-js"
import type { Announcement, Invoice, Order, Product, User } from '@/drizzle'

export type AdminResource =
  | 'products'
  | 'orders'
  | 'customers'
  | 'invoices'
  | 'announcements'

export type AdminRecord =
  | Product
  | Order
  | User
  | Invoice
  | Announcement

export function getAdminResourceTitle(resource: AdminResource) {
  switch (resource) {
    case 'products':
      return 'Product'
    case 'orders':
      return 'Order'
    case 'customers':
      return 'Customer'
    case 'invoices':
      return 'Invoice'
    case 'announcements':
      return 'Announcement'
    default:
      return 'Record'
  }
}

export function getAdminResourceStateLabel(resource: AdminResource, value: AdminRecord) {
  const v = value as any
  if ('status' in v && typeof v.status === 'string') return v.status
  if ('active' in v) return v.active ? 'active' : 'inactive'
  return 'draft'
}

export function createDefaultRecord(resource: AdminResource): AdminRecord {
  const now = Date.now()
  switch (resource) {
    case 'products':
      return {
        id: `p-${now}`,
        name: '',
        description: '',
        price: 0,
        original_price: undefined,
        image_ids: [],
        category: 'General',
        rating: 0,
        reviews: 0,
        stock: 0,
        features: [],
      } as unknown as Product
    case 'orders':
      return {
        id: `ORD-${now}`,
        userId: 'user-1',
        items: [],
        shippingAddress: {
          name: 'Customer',
          email: 'customer@example.com',
          phone: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'USA',
        },
        totalPrice: 0,
        status: 'pending',
        createdAt: new Date().toISOString(),
      } as unknown as Order
    case 'customers':
      return {
        id: `user-${now}`,
        email: '',
        name: '',
        role: 'customer',
        createdAt: new Date().toISOString(),
      } as unknown as User
    case 'invoices':
      return {
        id: `INV-${now}`,
        orderId: '',
        customerId: '',
        total: 0,
        status: 'draft',
        createdAt: new Date().toISOString(),
      } as unknown as Invoice
    case 'announcements':
      return {
        id: `ann-${now}`,
        title: '',
        message: '',
        type: 'info',
        publishedAt: new Date().toISOString(),
        active: true,
      } as unknown as Announcement
    default:
      return { id: `record-${now}` } as any
  }
}
