import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../../drizzle/schema'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client, { schema })

export {
  // New schema tables
  resUsers, userRoleEnum,
  resGroups,
  resPermissions,
  resShops,
  resPartner, partnerTypeEnum,
  m2mUsersGroups,
  m2mGroupsPermissions,
  m2mUsersShops,
  // Legacy business tables
  product_template,
  orders,
  invoices,
  announcements,
  settings,
  configurations,
  product_attributes,
  product_attribute_values,
  product_attributes_rel,
  product_variants,
  product_categories,
  product_brand,
  tax_rates,
  shipping_zones,
  shipping_zone_product,
  addresses,
  payment_methods,
  order_lines,
  payment_transactions,
  coupons,
  product_reviews,
  wishlist_items,
  cart_items,
  shipping_methods,
  pages,
  menus,
  currencies,
  audit_logs,
  shops,
} from '../../drizzle/schema'

import type {
  ResUser,
  ResGroup,
  ResPermission,
  ResShop,
  ResPartner,
  M2mUsersGroup,
  M2mGroupsPermission,
  M2mUsersShop,
} from '../../drizzle/schema'

export type {
  ResUser, NewResUser,
  ResGroup, NewResGroup,
  ResPermission, NewResPermission,
  ResShop, NewResShop,
  ResPartner, NewResPartner,
  M2mUsersGroup, NewM2mUsersGroup,
  M2mGroupsPermission, NewM2mGroupsPermission,
  M2mUsersShop, NewM2mUsersShop,
  // Legacy business types
  Currency,
  ProductTemplate,
  Order,
  Invoice,
  Announcement,
  Setting,
  Configuration,
  ProductAttribute,
  ProductAttributeValue,
  ProductVariant,
  ProductCategory,
  Brand,
  TaxRate,
  ShippingZone,
  ShippingZoneProduct,
  Address,
  PaymentMethod,
  OrderLine,
  PaymentTransaction,
  Coupon,
  ProductReview,
  WishlistItem,
  CartItem,
  ShippingMethod,
  Page,
  Menu,
  AuditLog,
  Shop,
} from '../../drizzle/schema'

// Backward-compat aliases (old tables merged into new schema)
export type User = ResUser
export type StaffAccount = ResUser
export type Role = ResGroup
export type Permission = ResPermission
