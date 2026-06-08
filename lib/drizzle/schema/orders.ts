import { pgTable, serial, text, jsonb, numeric, boolean, integer, timestamp } from 'drizzle-orm/pg-core'
import { orderStatusEnum, orderChannelEnum } from './_enums'
import { auditColumns } from './_shared'
import { resShops } from './res_shops'

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id').references(() => resShops.id, { onDelete: 'set null' }),
  user_id: text('user_id').notNull(),
  shipping_address: jsonb('shipping_address').notNull(),
  total_price: numeric('total_price', { precision: 12, scale: 2 }).notNull().default('0'),
  status: orderStatusEnum('status').notNull().default('pending'),
  channel: orderChannelEnum('channel').default('web'),
  tracking_number: text('tracking_number'),
  paid_at: timestamp('paid_at', { mode: 'string' }),
  fulfilled_at: timestamp('fulfilled_at', { mode: 'string' }),
  delivered_at: timestamp('delivered_at', { mode: 'string' }),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
})
