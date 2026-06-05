import { relations } from "drizzle-orm";

// ─── Re-export all values (single statement) ───

export {
  userRoleEnum,
  resUsers,
  resGroups,
  resPermissions,
  resShops,
  partnerTypeEnum,
  resPartner,
  m2mUsersGroups,
  m2mUsersGroupsRelations,
  m2mGroupsPermissions,
  m2mGroupsPermissionsRelations,
  m2mUsersShops,
  m2mUsersShopsRelations,
  currencies,
  product_template,
  product_brand,
  tax_rates,
  product_categories,
  shipping_zones,
  shipping_zone_product,
  product_attributes,
  product_attribute_values,
  product_attributes_rel,
  product_variants,
  orders,
  invoices,
  announcements,
  irUserConfig,
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
  audit_logs,
} from '@/lib/drizzle/schema'

export type {
  ResUser, NewResUser,
  ResGroup, NewResGroup,
  ResPermission, NewResPermission,
  ResShop, NewResShop,
  ResPartner, NewResPartner,
  M2mUsersGroup, NewM2mUsersGroup,
  M2mGroupsPermission, NewM2mGroupsPermission,
  M2mUsersShop, NewM2mUsersShop,
} from '@/lib/drizzle/schema'

// ─── Local bindings (for relations & type exports) ───
// These are also exported via the export-from block above

import {
  resShops,
  m2mUsersShops,
  audit_logs,
  currencies,
  product_template,
  product_brand,
  tax_rates,
  product_categories,
  shipping_zones,
  shipping_zone_product,
  product_attributes,
  product_attribute_values,
  product_attributes_rel,
  product_variants,
  orders,
  invoices,
  announcements,
  irUserConfig,
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
} from '@/lib/drizzle/schema'

// ─── Relations ───

export const shopsStaffRelations = relations(resShops, ({ many }) => ({
  m2mStaff: many(m2mUsersShops),
}))

// ─── Type exports ───

export type AuditLog = typeof audit_logs.$inferSelect;
export type Currency = typeof currencies.$inferSelect;
export type ProductTemplate = typeof product_template.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type IrUserConfig = typeof irUserConfig.$inferSelect;

export type Brand = typeof product_brand.$inferSelect;
export type TaxRate = typeof tax_rates.$inferSelect;
export type ProductCategory = typeof product_categories.$inferSelect;
export type ShippingZone = typeof shipping_zones.$inferSelect;
export type ShippingZoneProduct = typeof shipping_zone_product.$inferSelect;
export type ProductAttribute = typeof product_attributes.$inferSelect;
export type ProductAttributeValue = typeof product_attribute_values.$inferSelect;
export type ProductAttributesRel = typeof product_attributes_rel.$inferSelect;
export type ProductVariant = typeof product_variants.$inferSelect;

export type ResUserAddress = typeof resUserAddresses.$inferSelect;
export type PaymentMethod = typeof payment_methods.$inferSelect;
export type OrderLine = typeof order_lines.$inferSelect;
export type PaymentTransaction = typeof payment_transactions.$inferSelect;
export type Coupon = typeof coupons.$inferSelect;
export type ProductReview = typeof product_reviews.$inferSelect;
export type WishlistItem = typeof wishlist_items.$inferSelect;
export type CartItem = typeof cart_items.$inferSelect;
export type ShippingMethod = typeof shipping_methods.$inferSelect;
export type Page = typeof pages.$inferSelect;
export type Menu = typeof menus.$inferSelect;

export type Shop = typeof resShops.$inferSelect;
