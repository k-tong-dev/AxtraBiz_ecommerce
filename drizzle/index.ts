import {drizzle} from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// For server-side usage only
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
}

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, {prepare: false})
export const db = drizzle(client, {schema})

// Export all tables for easy access
export {
    users,
    product_template,
    orders,
    invoices,
    announcements,
    settings,
    configurations,
    product_brand,
    product_categories,
    product_variants,
    product_attributes,
    product_attribute_values,
    product_attributes_rel,
    shipping_zones,
    shipping_zone_product,
    tax_rates,
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
} from './schema'

export type {
    User,
    ProductTemplate,
    Order,
    Invoice,
    Announcement,
    Setting,
    Configuration,
    Brand,
    ProductCategory,
    ProductVariant,
    ProductAttribute,
    ProductAttributeValue,
    ShippingZone,
    TaxRate,
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
} from './schema'
