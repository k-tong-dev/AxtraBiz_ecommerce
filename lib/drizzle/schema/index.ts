// ─── Import tables locally for type inference ───
import { currencies } from '@/lib/drizzle/schema/res_currencies'
import { tax_rates } from '@/lib/drizzle/schema/tax_rates'
import { product_template } from '@/lib/drizzle/schema/product_template'
import { product_brand } from '@/lib/drizzle/schema/product_brand'
import { shipping_zones } from '@/lib/drizzle/schema/shipping_zones'
import { shipping_zone_product } from '@/lib/drizzle/schema/shipping_zone_product'
import { product_attributes } from '@/lib/drizzle/schema/product_attributes'
import { product_attribute_values } from '@/lib/drizzle/schema/product_attribute_values'
import { product_attributes_rel } from '@/lib/drizzle/schema/product_attributes_rel'
import { product_variants } from '@/lib/drizzle/schema/product_variants'
import { orders } from '@/lib/drizzle/schema/orders'
import { invoices } from '@/lib/drizzle/schema/invoices'
import { announcements } from '@/lib/drizzle/schema'
import { payment_methods } from '@/lib/drizzle/schema'
import { order_lines } from '@/lib/drizzle/schema/order_lines'
import { payment_transactions } from '@/lib/drizzle/schema'
import { coupons } from '@/lib/drizzle/schema/coupons'
import { product_reviews } from '@/lib/drizzle/schema'
import { wishlist_items } from '@/lib/drizzle/schema'
import { cart_items } from '@/lib/drizzle/schema'
import { shipping_methods } from '@/lib/drizzle/schema'
import { pages } from '@/lib/drizzle/schema/ir_pages'
import { menus } from '@/lib/drizzle/schema/ir_menus'
import { audit_logs } from '@/lib/drizzle/schema/ir_audit_logs'
import { resShops } from '@/lib/drizzle/schema/res_shops'


// ─── Business enums & helpers ───
export * from '@/lib/drizzle/schema/_enums'
export { auditColumns, timestamps } from '@/lib/drizzle/schema/_shared'

// ─── Auth / Access schema ───
export { userRoleEnum, resUsers } from '@/lib/drizzle/schema/res_users'
export { resGroups } from '@/lib/drizzle/schema/res_groups'
export { resPermissions } from '@/lib/drizzle/schema/res_permissions'

// ─── Business tables ───
export { resShops } from '@/lib/drizzle/schema/res_shops'
export { partnerTypeEnum, resPartner } from './res_partner'
export { currencies } from '@/lib/drizzle/schema/res_currencies'
export { product_template } from '@/lib/drizzle/schema/product_template'
export { product_brand } from '@/lib/drizzle/schema/product_brand'
export { tax_rates } from '@/lib/drizzle/schema/tax_rates'
export { product_categories } from '@/lib/drizzle/schema/product_categories'
export { shipping_zones } from '@/lib/drizzle/schema/shipping_zones'
export { shipping_zone_product } from '@/lib/drizzle/schema/shipping_zone_product'
export { product_attributes } from '@/lib/drizzle/schema/product_attributes'
export { product_attribute_values } from '@/lib/drizzle/schema/product_attribute_values'
export { product_attributes_rel } from '@/lib/drizzle/schema/product_attributes_rel'
export { product_variants } from '@/lib/drizzle/schema/product_variants'
export { orders } from '@/lib/drizzle/schema/orders'
export { invoices } from '@/lib/drizzle/schema/invoices'
export { announcements } from '@/lib/drizzle/schema/announcements'
export { irUserConfig } from '@/lib/drizzle/schema/ir_user_config'
export { resUserAddresses } from '@/lib/drizzle/schema/res_user_addresses'
export { payment_methods } from '@/lib/drizzle/schema/payment_methods'
export { order_lines } from '@/lib/drizzle/schema/order_lines'
export { payment_transactions } from '@/lib/drizzle/schema/payment_transactions'
export { coupons } from '@/lib/drizzle/schema/coupons'
export { product_reviews } from '@/lib/drizzle/schema/product_reviews'
export { wishlist_items } from '@/lib/drizzle/schema/wishlist_items'
export { cart_items } from '@/lib/drizzle/schema/cart_items'
export { shipping_methods } from '@/lib/drizzle/schema/shipping_methods'
export { pages } from '@/lib/drizzle/schema/ir_pages'
export { menus } from '@/lib/drizzle/schema/ir_menus'
export { audit_logs } from '@/lib/drizzle/schema/ir_audit_logs'


// ─── M2M tables (after parent tables) ───
export { m2mUsersGroups, m2mUsersGroupsRelations } from './m2m_users_groups'
export { m2mGroupsPermissions, m2mGroupsPermissionsRelations } from './m2m_groups_permissions'
export { m2mUsersShops, m2mUsersShopsRelations } from './m2m_users_shops'

export type { M2mUsersGroup, NewM2mUsersGroup } from './m2m_users_groups'
export type { M2mGroupsPermission, NewM2mGroupsPermission } from './m2m_groups_permissions'
export type { M2mUsersShop, NewM2mUsersShop } from './m2m_users_shops'

export type { ResPartner, NewResPartner } from './res_partner'
export type { ProductCategory } from './product_categories'
export type { IrUserConfig } from './ir_user_config'
export type { ResUserAddress } from './res_user_addresses'
export type { ResShop, NewResShop } from './res_shops'
export type Currency = typeof currencies.$inferSelect
export type ProductTemplate = typeof product_template.$inferSelect
export type Order = typeof orders.$inferSelect
export type Invoice = typeof invoices.$inferSelect
export type Announcement = typeof announcements.$inferSelect
export type Brand = typeof product_brand.$inferSelect
export type TaxRate = typeof tax_rates.$inferSelect
export type ShippingZone = typeof shipping_zones.$inferSelect
export type ShippingZoneProduct = typeof shipping_zone_product.$inferSelect
export type ProductAttribute = typeof product_attributes.$inferSelect
export type ProductAttributeValue = typeof product_attribute_values.$inferSelect
export type ProductAttributesRel = typeof product_attributes_rel.$inferSelect
export type ProductVariant = typeof product_variants.$inferSelect
export type PaymentMethod = typeof payment_methods.$inferSelect
export type OrderLine = typeof order_lines.$inferSelect
export type PaymentTransaction = typeof payment_transactions.$inferSelect
export type  Coupon  = typeof coupons.$inferSelect
export type ProductReview = typeof product_reviews.$inferSelect
export type WishlistItem = typeof wishlist_items.$inferSelect
export type CartItem = typeof cart_items.$inferSelect
export type ShippingMethod = typeof shipping_methods.$inferSelect
export type Page = typeof pages.$inferSelect
export type Menu = typeof menus.$inferSelect
export type AuditLog = typeof audit_logs.$inferSelect
export type { ResUser, NewResUser } from './res_users'
export type { ResGroup, NewResGroup } from './res_groups'
export type { ResPermission, NewResPermission } from './res_permissions'

// ─── Backward-compat aliases ───
import type { ResUser, NewResUser } from './res_users'
import type { ResGroup, NewResGroup } from './res_groups'
import type { ResPermission, NewResPermission } from './res_permissions'

export type Shop = typeof resShops.$inferSelect
export type User = ResUser
export type Role = ResGroup
export type Permission = ResPermission
