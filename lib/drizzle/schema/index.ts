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
export { settings } from './settings'
export { configurations } from './configurations'
export { addresses } from './addresses'
export { payment_methods } from './payment_methods'
export { order_lines } from './order_lines'
export { payment_transactions } from './payment_transactions'
export { coupons } from './coupons'
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
