// Server-only Drizzle client - DO NOT import in client components
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
  currencies,
  product_template,
  orders,
  invoices,
  announcements,
  irUserConfig,
  product_categories,
  product_brand,
  tax_rates,
  shipping_zones,
  shipping_zone_product,
  product_attributes,
  product_attribute_values,
  product_attributes_rel,
  product_variants,
  resUserAddresses,
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
} from '../../drizzle/schema'

export type {
  Currency,
  ProductTemplate,
  Order,
  Invoice,
  Announcement,
  IrUserConfig,
  ProductCategory,
  Brand,
  TaxRate,
  ShippingZone,
  ProductAttribute,
  ProductAttributeValue,
  ProductVariant,
  ResUserAddress,
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
} from '../../drizzle/schema'
