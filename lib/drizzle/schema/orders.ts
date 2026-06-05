import { pgTable, serial, text, jsonb, numeric, boolean, integer } from 'drizzle-orm/pg-core'
import { orderStatusEnum } from './_enums'
import { auditColumns } from './_shared'
import { resShops } from './res_shops'

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id').references(() => resShops.id, { onDelete: 'set null' }),
  user_id: text('user_id').notNull(),
  items: jsonb('items').notNull().default('[]'),
  shipping_address: jsonb('shipping_address').notNull(),
  total_price: numeric('total_price', { precision: 12, scale: 2 }).notNull().default('0'),
  status: orderStatusEnum('status').notNull().default('pending'),
  tracking_number: text('tracking_number'),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
})
