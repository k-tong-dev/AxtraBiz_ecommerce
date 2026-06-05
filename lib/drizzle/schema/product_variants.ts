import { pgTable, serial, text, numeric, timestamp, integer, jsonb, boolean } from 'drizzle-orm/pg-core'
import { auditColumns } from './_shared'
import { product_template } from './product_template'

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
})
