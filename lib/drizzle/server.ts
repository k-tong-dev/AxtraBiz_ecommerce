import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@/drizzle/schema'

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
  irUserConfig,
  product_attributes,
  product_attribute_values,
  product_attributes_rel,
  product_variants,
  product_categories,
  product_brand,
  tax_rates,
  shipping_zones,
  shipping_zone_product,
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
  currencies,
  audit_logs,
  // Alias
  shops,
} from '@/drizzle/schema'
