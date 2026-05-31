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
  base_sku: text('sku').default(''),
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
