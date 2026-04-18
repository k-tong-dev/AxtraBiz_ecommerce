import type { Announcement, Invoice, Order, Product, Setting, User } from '@/drizzle'
import {
  fetchProductsFromDrizzle,
  upsertProductInDrizzle,
  deleteProductFromDrizzle,
} from '@/lib/drizzle/products'
import {
  fetchOrdersFromDrizzle,
  upsertOrderInDrizzle,
  deleteOrderFromDrizzle,
} from '@/lib/drizzle/orders'
import {
  fetchUsersFromDrizzle,
  upsertUserInDrizzle,
  deleteUserFromDrizzle,
} from '@/lib/drizzle/users'
import {
  fetchInvoicesFromDrizzle,
  upsertInvoiceInDrizzle,
  deleteInvoiceFromDrizzle,
} from '@/lib/drizzle/invoices'
import {
  fetchAnnouncementsFromDrizzle,
  upsertAnnouncementInDrizzle,
  deleteAnnouncementFromDrizzle,
} from '@/lib/drizzle/announcements'
import {
  fetchSettingsFromDrizzle,
  upsertSettingInDrizzle,
  deleteSettingFromDrizzle,
} from '@/lib/drizzle/settings'
import {
  fetchConfigurationsFromDrizzle,
  upsertConfigurationInDrizzle,
  deleteConfigurationFromDrizzle,
} from '@/lib/drizzle/configurations'

export type AdminResource =
  | 'products'
  | 'orders'
  | 'customers'
  | 'invoices'
  | 'announcements'
  | 'settings'
  | 'configurations'

export type AdminRecord =
  | Product
  | Order
  | User
  | Invoice
  | Announcement
  | Setting

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
    case 'settings':
      return 'Setting'
    case 'configurations':
      return 'Configuration'
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

export async function fetchRecords(resource: AdminResource): Promise<AdminRecord[]> {
  switch (resource) {
    case 'products':
      return fetchProductsFromDrizzle()
    case 'orders':
      return fetchOrdersFromDrizzle()
    case 'customers':
      return fetchUsersFromDrizzle()
    case 'invoices':
      return fetchInvoicesFromDrizzle()
    case 'announcements':
      return fetchAnnouncementsFromDrizzle()
    case 'settings':
      return fetchSettingsFromDrizzle()
    case 'configurations':
      const configs = await fetchConfigurationsFromDrizzle()
      // Transform Configuration to Setting type structure
      return configs.map(config => ({
        id: config.id,
        key: config.name, // Use name as key for Setting type
        value: config.value,
        category: config.category,
        created_at: config.created_at,
        updated_at: config.updated_at,
      }))
    default:
      return []
  }
}

export async function fetchRecordById(resource: AdminResource, id: string): Promise<AdminRecord | null> {
  const items = await fetchRecords(resource)
  return (items as any[]).find((item) => item.id === id) ?? null
}

export async function upsertRecord(resource: AdminResource, value: AdminRecord): Promise<boolean> {
  switch (resource) {
    case 'products':
      const productResult = await upsertProductInDrizzle(value as Product)
      return productResult.success
    case 'orders':
      const orderResult = await upsertOrderInDrizzle(value as any)
      return orderResult.success
    case 'customers':
      const userResult = await upsertUserInDrizzle(value as any)
      return userResult.success
    case 'invoices':
      const invoiceResult = await upsertInvoiceInDrizzle(value as any)
      return invoiceResult.success
    case 'announcements':
      const announcementResult = await upsertAnnouncementInDrizzle(value as any)
      return announcementResult.success
    case 'settings':
      const settingResult = await upsertSettingInDrizzle(value as any)
      return settingResult.success
    case 'configurations':
      const configResult = await upsertConfigurationInDrizzle(value as any)
      return configResult.success
    default:
      return false
  }
}

export async function deleteRecord(resource: AdminResource, id: string): Promise<boolean> {
  switch (resource) {
    case 'products':
      return deleteProductFromDrizzle(id)
    case 'orders':
      return deleteOrderFromDrizzle(id)
    case 'customers':
      return deleteUserFromDrizzle(id)
    case 'invoices':
      return deleteInvoiceFromDrizzle(id)
    case 'announcements':
      return deleteAnnouncementFromDrizzle(id)
    case 'settings':
      return deleteSettingFromDrizzle(id)
    case 'configurations':
      return deleteConfigurationFromDrizzle(id)
    default:
      return false
  }
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
        image: '',
        images: [],
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
    case 'settings':
      return {
        id: `set-${now}`,
        key: '',
        value: '',
        updatedAt: new Date().toISOString(),
      } as unknown as Setting
    case 'configurations':
      return {
        id: `conf-${now}`,
        key: '',
        value: '',
        updatedAt: new Date().toISOString(),
      } as unknown as Setting
    default:
      return { id: `record-${now}` } as any
  }
}

