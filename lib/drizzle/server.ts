import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../../drizzle/schema'

// For server-side usage only
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client, { schema })

// Export all tables for easy access
export {
  users,
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
  staff_accounts,
  roles,
  permissions,
  role_permissions,
  staff_roles,
} from '../../drizzle/schema'

export type {
  User,
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
  StaffAccount,
  Role,
  Permission,
  RolePermission,
  StaffRole,
} from '../../drizzle/schema'
