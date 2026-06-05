// ─── Auth / Access schema ───
export { userRoleEnum, resUsers } from './res_users'
export type { ResUser, NewResUser } from './res_users'

export { resGroups } from './res_groups'
export type { ResGroup, NewResGroup } from './res_groups'

export { resPermissions } from './res_permissions'
export type { ResPermission, NewResPermission } from './res_permissions'

export { resShops } from './res_shops'
export type { ResShop, NewResShop } from './res_shops'

export { partnerTypeEnum, resPartner } from './res_partner'
export type { ResPartner, NewResPartner } from './res_partner'

// ─── Business enums & helpers ───
export * from './_enums'
export { auditColumns, timestamps } from './_shared'

// ─── Business tables ───
export { currencies } from './res_currencies'
export type { } from './res_currencies'

export { product_template } from './product_template'
export { product_brand } from './product_brand'
export { tax_rates } from './tax_rates'

export { product_categories } from './product_categories'
export type { ProductCategory } from './product_categories'

export { shipping_zones } from './shipping_zones'
export { shipping_zone_product } from './shipping_zone_product'

export { product_attributes } from './product_attributes'
export { product_attribute_values } from './product_attribute_values'
export { product_attributes_rel } from './product_attributes_rel'
export { product_variants } from './product_variants'

export { orders } from './orders'
export { invoices } from './invoices'
export { announcements } from './announcements'
export { irUserConfig } from './ir_user_config'
export type { IrUserConfig } from './ir_user_config'
export { resUserAddresses } from './res_user_addresses'
export type { ResUserAddress } from './res_user_addresses'
export { payment_methods } from './payment_methods'
export { order_lines } from './order_lines'
export { payment_transactions } from './payment_transactions'

export { coupons } from './coupons'
export type { Coupon } from './coupons'

export { product_reviews } from './product_reviews'
export { wishlist_items } from './wishlist_items'
export { cart_items } from './cart_items'
export { shipping_methods } from './shipping_methods'
export { pages } from './ir_pages'
export { menus } from './ir_menus'
export { audit_logs } from './ir_audit_logs'

// ─── M2M tables (after parent tables) ───
export { m2mUsersGroups, m2mUsersGroupsRelations } from './m2m_users_groups'
export type { M2mUsersGroup, NewM2mUsersGroup } from './m2m_users_groups'

export { m2mGroupsPermissions, m2mGroupsPermissionsRelations } from './m2m_groups_permissions'
export type { M2mGroupsPermission, NewM2mGroupsPermission } from './m2m_groups_permissions'

export { m2mUsersShops, m2mUsersShopsRelations } from './m2m_users_shops'
export type { M2mUsersShop, NewM2mUsersShop } from './m2m_users_shops'

// ─── Import tables locally for type inference ───
import { currencies } from './res_currencies'
import { product_template } from './product_template'
import { product_brand } from './product_brand'
import { tax_rates } from './tax_rates'
import { shipping_zones } from './shipping_zones'
import { shipping_zone_product } from './shipping_zone_product'
import { product_attributes } from './product_attributes'
import { product_attribute_values } from './product_attribute_values'
import { product_attributes_rel } from './product_attributes_rel'
import { product_variants } from './product_variants'
import { orders } from './orders'
import { invoices } from './invoices'
import { announcements } from './announcements'
import { payment_methods } from './payment_methods'
import { order_lines } from './order_lines'
import { payment_transactions } from './payment_transactions'
import { product_reviews } from './product_reviews'
import { wishlist_items } from './wishlist_items'
import { cart_items } from './cart_items'
import { shipping_methods } from './shipping_methods'
import { pages } from './ir_pages'
import { menus } from './ir_menus'
import { audit_logs } from './ir_audit_logs'
import { resShops } from './res_shops'

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
export type ProductReview = typeof product_reviews.$inferSelect
export type WishlistItem = typeof wishlist_items.$inferSelect
export type CartItem = typeof cart_items.$inferSelect
export type ShippingMethod = typeof shipping_methods.$inferSelect
export type Page = typeof pages.$inferSelect
export type Menu = typeof menus.$inferSelect
export type AuditLog = typeof audit_logs.$inferSelect

import type { ResUser } from './res_users'
import type { ResGroup } from './res_groups'
import type { ResPermission } from './res_permissions'

export type Shop = typeof resShops.$inferSelect

// ─── Backward-compat aliases ───
export type User = ResUser
export type StaffAccount = ResUser
export type Role = ResGroup
export type Permission = ResPermission
