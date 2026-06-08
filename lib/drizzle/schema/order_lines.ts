import { pgTable, serial, text, numeric, integer } from 'drizzle-orm/pg-core'
import { timestamps } from './_shared'
import { orders } from './orders'
import { product_template } from './product_template'
import { product_variants } from './product_variants'
import { lineStatusEnum } from './_enums'

export const order_lines = pgTable('order_lines', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  product_id: integer('product_id').references(() => product_template.id, { onDelete: 'set null' }),
  variant_id: integer('variant_id').references(() => product_variants.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  sku: text('sku'),
  quantity: integer('quantity').notNull().default(1),
  unit_price: numeric('unit_price', { precision: 12, scale: 2 }).notNull().default('0'),
  cost_price: numeric('cost_price', { precision: 12, scale: 2 }).default('0'),
  discount: numeric('discount', { precision: 12, scale: 2 }).default('0'),
  tax: numeric('tax', { precision: 12, scale: 2 }).default('0'),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull().default('0'),
  status: lineStatusEnum('status').default('pending'),
  ...timestamps,
})
