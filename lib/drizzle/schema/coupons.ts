import { pgTable, serial, text, timestamp, numeric, boolean, integer } from 'drizzle-orm/pg-core'
import { couponTypeEnum } from './_enums'
import { auditColumns } from './_shared'

export const coupons = pgTable('coupons', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id'),
  code: text('code').notNull().unique(),
  description: text('description'),
  type: couponTypeEnum('type').notNull().default('percentage'),
  value: numeric('value', { precision: 12, scale: 2 }).notNull().default('0'),
  min_order_amount: numeric('min_order_amount', { precision: 12, scale: 2 }),
  max_uses: integer('max_uses'),
  used_count: integer('used_count').notNull().default(0),
  starts_at: timestamp('starts_at', { mode: 'string' }),
  expires_at: timestamp('expires_at', { mode: 'string' }),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
})
