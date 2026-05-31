import { 
  pgTable, 
  serial, 
  text, 
  varchar, 
  numeric, 
  timestamp, 
  integer,
  jsonb,
  boolean
} from "drizzle-orm/pg-core";

/**
 * Reusable audit/tracking columns used across all models
 * These fields track creation, updates, and user actions
 */
export const auditColumns = {
  created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
  create_uid: text('create_uid'),
  write_uid: text('write_uid'),
};

/**
 * Reusable timestamp columns (without audit UIDs)
 * Useful for simpler tables that don't need user tracking
 */
export const timestamps = {
  created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
};

// Users table — id stores Supabase Auth UUID, not auto-increment
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull().default('customer'),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
});

// Product template table
export const product_template = pgTable('product_template', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description').notNull().default(''),
  price: numeric('price', { precision: 12, scale: 2 }).notNull().default('0'),
  compare_price: numeric('compare_price', { precision: 12, scale: 2 }).default('0'),
  cost_price: numeric('cost_price', { precision: 12, scale: 2 }).default('0'),
  original_price: numeric('original_price', { precision: 12, scale: 2 }),
  image_id: jsonb('image_id'),
  image_ids: jsonb('image_ids').notNull().default('[]'),
  base_sku: text('base_sku').default(''),
  barcode: text('barcode').default(''),
  category_id: integer('category_id').references(() => product_categories.id, { onDelete: 'set null' }),
  brand_id: integer('brand_id').references(() => product_brand.id, { onDelete: 'set null' }),
  tax_rate_id: integer('tax_rate_id').references(() => tax_rates.id, { onDelete: 'set null' }),
  product_type: text('product_type').notNull().default('simple'), // simple, variable, grouped, bundle, digital
  status: text('status').notNull().default('draft'), // draft, published, archived
  meta_title: text('meta_title'),
  meta_description: text('meta_description'),
  meta_keywords: text('meta_keywords'),
  tags: jsonb('tags').notNull().default('[]'),
  rating: numeric('rating', { precision: 3, scale: 2 }).notNull().default('0'),
  reviews: integer('reviews').notNull().default(0),
  stock: integer('stock').notNull().default(0),
  track_inventory: boolean('track_inventory').default(true).notNull(),
  low_stock_threshold: integer('low_stock_threshold').default(10),
  allow_backorders: boolean('allow_backorders').default(false),
  weight: numeric('weight', { precision: 8, scale: 2 }).default('0'),
  dimensions: text('dimensions').default(''),
  sale_start_date: timestamp('sale_start_date', { mode: 'string' }),
  sale_end_date: timestamp('sale_end_date', { mode: 'string' }),
  published_at: timestamp('published_at', { mode: 'string' }),
  active: boolean('active').default(true).notNull(),
  features: jsonb('features').notNull().default('[]'),
  ...auditColumns,
});

// Brands table
export const product_brand = pgTable('product_brand', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  image_id: jsonb('image_id'),
  website: text('website'),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
});

// Tax rates table
export const tax_rates = pgTable('tax_rates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  rate: numeric('rate', { precision: 5, scale: 2 }).notNull(),
  country: text('country').notNull(),
  region: text('region'),
  postal_code: text('postal_code'),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
});

// Product categories table
export const product_categories = pgTable('product_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  parent_id: integer('parent_id').references(() => product_categories.id, { onDelete: 'set null' }),
  image_id: jsonb('image_id'),
  position: integer('position').default(0),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
}) as any;

// Shipping zones table
export const shipping_zones = pgTable('shipping_zones', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  countries: jsonb('countries').notNull().default('[]'),
  regions: jsonb('regions').notNull().default('[]'),
  base_rate: numeric('base_rate', { precision: 12, scale: 2 }).default('0'),
  free_shipping_threshold: numeric('free_shipping_threshold', { precision: 12, scale: 2 }),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
});

// Shipping zone product relation table
export const shipping_zone_product = pgTable('shipping_zone_product', {
  id: serial('id').primaryKey(),
  shipping_zone_id: integer('shipping_zone_id').notNull().references(() => shipping_zones.id, { onDelete: 'cascade' }),
  product_id: integer('product_id').notNull().references(() => product_template.id, { onDelete: 'cascade' }),
  custom_rate: numeric('custom_rate', { precision: 12, scale: 2 }),
  active: boolean('active').default(true).notNull(),
  ...timestamps,
});

// Product attributes table
export const product_attributes = pgTable('product_attributes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(), // select, radio, color, text
  position: integer('position').default(0),
  ...auditColumns,
});

// Product attribute values table
// Each value belongs to exactly one attribute (one2many)
export const product_attribute_values = pgTable('product_attribute_values', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  value: text('value').notNull(), // The actual value (e.g., 'red', 'M', 'XL')
  attribute_id: integer('attribute_id').references(() => product_attributes.id, { onDelete: 'set null' }),
  position: integer('position').default(0),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
});

// Product attributes relation table
export const product_attributes_rel = pgTable('product_attributes_rel', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').notNull().references(() => product_template.id, { onDelete: 'cascade' }),
  attribute_id: integer('attribute_id').notNull().references(() => product_attributes.id, { onDelete: 'cascade' }),
  position: integer('position').default(0),
  ...timestamps,
});

// Product variants table
export const product_variants = pgTable('product_variants', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').notNull().references(() => product_template.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  sku: text('sku').unique(),
  barcode: text('barcode').unique(),
  price: numeric('price', { precision: 12, scale: 2 }).notNull().default('0'),
  compare_price: numeric('compare_price', { precision: 12, scale: 2 }).default('0'),
  cost_price: numeric('cost_price', { precision: 12, scale: 2 }).default('0'),
  stock: integer('stock').notNull().default(0),
  weight: numeric('weight', { precision: 8, scale: 2 }).default('0'),
  image_ids: jsonb('image_ids').notNull().default('[]'),
  attributes: jsonb('attributes').notNull().default('{}'),
  position: integer('position').default(0),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
});

// Orders table
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id, { onUpdate: 'cascade', onDelete: 'restrict' }),
  items: jsonb('items').notNull().default('[]'),
  shipping_address: jsonb('shipping_address').notNull(),
  total_price: numeric('total_price', { precision: 12, scale: 2 }).notNull().default('0'),
  status: text('status').notNull().default('pending'),
  tracking_number: text('tracking_number'),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
});

// Invoices table
export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').notNull().references(() => orders.id, { onUpdate: 'cascade', onDelete: 'restrict' }),
  invoice_number: text('invoice_number').notNull().unique(),
  user_id: text('user_id').notNull().references(() => users.id, { onUpdate: 'cascade', onDelete: 'restrict' }),
  items: jsonb('items').notNull().default('[]'),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull().default('0'),
  tax: numeric('tax', { precision: 12, scale: 2 }).notNull().default('0'),
  total: numeric('total', { precision: 12, scale: 2 }).notNull().default('0'),
  status: text('status').notNull().default('pending'),
  due_date: timestamp('due_date', { mode: 'string' }),
  ...auditColumns,
});

// Announcements table
export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  type: text('type').notNull().default('info'),
  active: boolean('active').notNull().default(true),
  start_date: timestamp('start_date', { mode: 'string' }),
  end_date: timestamp('end_date', { mode: 'string' }),
  ...auditColumns,
});

// Settings table
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  category: text('category').notNull().default('general'),
  ...auditColumns,
});

// Configuration table
export const configurations = pgTable('configurations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  value: text('value').notNull(),
  type: text('type').notNull().default('string'),
  category: text('category').notNull().default('general'),
  ...auditColumns,
});

// ===== New tables for production e-commerce =====

// Addresses table
export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull().default('shipping'), // billing, shipping
  name: text('name').notNull(),
  street: text('street').notNull(),
  street2: text('street2'),
  city: text('city').notNull(),
  state: text('state'),
  postal_code: text('postal_code').notNull(),
  country: text('country').notNull().default('US'),
  phone: text('phone'),
  is_default: boolean('is_default').default(false),
  ...auditColumns,
});

// Payment methods table
export const payment_methods = pgTable('payment_methods', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // credit_card, paypal, stripe
  last4: text('last4'),
  brand: text('brand'), // Visa, Mastercard, etc.
  expiry_month: integer('expiry_month'),
  expiry_year: integer('expiry_year'),
  is_default: boolean('is_default').default(false),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
});

// Order lines table (replaces JSON blob in orders.items)
export const order_lines = pgTable('order_lines', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  product_id: integer('product_id').references(() => product_template.id, { onDelete: 'set null' }),
  variant_id: integer('variant_id').references(() => product_variants.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  sku: text('sku'),
  quantity: integer('quantity').notNull().default(1),
  unit_price: numeric('unit_price', { precision: 12, scale: 2 }).notNull().default('0'),
  discount: numeric('discount', { precision: 12, scale: 2 }).default('0'),
  tax: numeric('tax', { precision: 12, scale: 2 }).default('0'),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull().default('0'),
  ...timestamps,
});

// Payment transactions table
export const payment_transactions = pgTable('payment_transactions', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').notNull().references(() => orders.id, { onDelete: 'restrict' }),
  invoice_id: integer('invoice_id').references(() => invoices.id, { onDelete: 'set null' }),
  user_id: text('user_id').notNull().references(() => users.id, { onDelete: 'restrict' }),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull().default('0'),
  currency: text('currency').notNull().default('USD'),
  payment_method: text('payment_method').notNull(), // stripe, paypal, etc.
  status: text('status').notNull().default('pending'), // pending, completed, failed, refunded
  transaction_id: text('transaction_id'),
  paid_at: timestamp('paid_at', { mode: 'string' }),
  ...auditColumns,
});

// Coupons / discounts table
export const coupons = pgTable('coupons', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  description: text('description'),
  type: text('type').notNull().default('percentage'), // percentage, fixed_amount, free_shipping
  value: numeric('value', { precision: 12, scale: 2 }).notNull().default('0'),
  min_order_amount: numeric('min_order_amount', { precision: 12, scale: 2 }),
  max_uses: integer('max_uses'),
  used_count: integer('used_count').notNull().default(0),
  starts_at: timestamp('starts_at', { mode: 'string' }),
  expires_at: timestamp('expires_at', { mode: 'string' }),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
});

// Product reviews table
export const product_reviews = pgTable('product_reviews', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  product_id: integer('product_id').notNull().references(() => product_template.id, { onDelete: 'cascade' }),
  variant_id: integer('variant_id').references(() => product_variants.id, { onDelete: 'set null' }),
  rating: integer('rating').notNull().default(5),
  title: text('title'),
  body: text('body'),
  approved: boolean('approved').default(false),
  ...auditColumns,
});

// Wishlist items table
export const wishlist_items = pgTable('wishlist_items', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  product_id: integer('product_id').notNull().references(() => product_template.id, { onDelete: 'cascade' }),
  variant_id: integer('variant_id').references(() => product_variants.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
});

// Cart items table (server-side for abandoned cart recovery)
export const cart_items = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  session_id: text('session_id'),
  product_id: integer('product_id').notNull().references(() => product_template.id, { onDelete: 'cascade' }),
  variant_id: integer('variant_id').references(() => product_variants.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
  created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

// Shipping methods table
export const shipping_methods = pgTable('shipping_methods', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  carrier: text('carrier'), // UPS, FedEx, USPS, etc.
  rate_type: text('rate_type').notNull().default('flat'), // flat, per_item, weight_based, free
  rate_amount: numeric('rate_amount', { precision: 12, scale: 2 }).notNull().default('0'),
  free_shipping_threshold: numeric('free_shipping_threshold', { precision: 12, scale: 2 }),
  estimated_days_min: integer('estimated_days_min'),
  estimated_days_max: integer('estimated_days_max'),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
});

// Pages table (CMS)
export const pages = pgTable('pages', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  content: text('content'),
  meta_title: text('meta_title'),
  meta_description: text('meta_description'),
  status: text('status').notNull().default('draft'), // draft, published
  published_at: timestamp('published_at', { mode: 'string' }),
  ...auditColumns,
});

// Menus table (CMS navigation)
export const menus = pgTable('menus', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  items: jsonb('items').notNull().default('[]'),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
});

// Type exports
export type User = typeof users.$inferSelect;
export type ProductTemplate = typeof product_template.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type Setting = typeof settings.$inferSelect;
export type Configuration = typeof configurations.$inferSelect;

export type Brand = typeof product_brand.$inferSelect;
export type TaxRate = typeof tax_rates.$inferSelect;
export type ProductCategory = typeof product_categories.$inferSelect;
export type ShippingZone = typeof shipping_zones.$inferSelect;
export type ShippingZoneProduct = typeof shipping_zone_product.$inferSelect;
export type ProductAttribute = typeof product_attributes.$inferSelect;
export type ProductAttributeValue = typeof product_attribute_values.$inferSelect;
export type ProductAttributesRel = typeof product_attributes_rel.$inferSelect;
export type ProductVariant = typeof product_variants.$inferSelect;

export type Address = typeof addresses.$inferSelect;
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
