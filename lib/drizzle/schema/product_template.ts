import { pgTable, serial, text, numeric, timestamp, integer, jsonb, boolean } from 'drizzle-orm/pg-core'
import { productTypeEnum, productStatusEnum, fulfillmentTypeEnum } from './_enums'
import { auditColumns } from './_shared'
import { currencies } from './res_currencies'
import { product_categories } from './product_categories'
import { product_brand } from './product_brand'
import { tax_rates } from './tax_rates'

export const product_template = pgTable('product_template', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id'),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull().default(''),
  price: numeric('price', { precision: 12, scale: 2 }).notNull().default('0'),
  compare_price: numeric('compare_price', { precision: 12, scale: 2 }).default('0'),
  cost_price: numeric('cost_price', { precision: 12, scale: 2 }).default('0'),
  original_price: numeric('original_price', { precision: 12, scale: 2 }),
  currency_code: text('currency_code').notNull().default('USD').references(() => currencies.code, { onDelete: 'set null' }),
  image_id: jsonb('image_id'),
  image_ids: jsonb('image_ids').notNull().default('[]'),
  base_sku: text('base_sku').default(''),
  barcode: text('barcode').default(''),
  category_id: integer('category_id').references(() => product_categories.id, { onDelete: 'set null' }),
  brand_id: integer('brand_id').references(() => product_brand.id, { onDelete: 'set null' }),
  tax_rate_id: integer('tax_rate_id').references(() => tax_rates.id, { onDelete: 'set null' }),
  product_type: productTypeEnum('product_type').notNull().default('simple'),
  fulfillment_type: fulfillmentTypeEnum('fulfillment_type').notNull().default('self'),
  status: productStatusEnum('status').notNull().default('draft'),
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
  supplier_id: integer('supplier_id'),
  supplier_sku: text('supplier_sku'),
  supplier_url: text('supplier_url'),
  sale_start_date: timestamp('sale_start_date', { mode: 'string' }),
  sale_end_date: timestamp('sale_end_date', { mode: 'string' }),
  published_at: timestamp('published_at', { mode: 'string' }),
  active: boolean('active').default(true).notNull(),
  features: jsonb('features').notNull().default('[]'),
  ...auditColumns,
})
