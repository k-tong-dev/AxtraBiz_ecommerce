import { pgTable, serial, text, numeric, boolean, integer } from 'drizzle-orm/pg-core'
import { shippingRateTypeEnum } from './_enums'
import { auditColumns } from './_shared'

export const shipping_methods = pgTable('shipping_methods', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id'),
  name: text('name').notNull(),
  carrier: text('carrier'),
  rate_type: shippingRateTypeEnum('rate_type').notNull().default('flat'),
  rate_amount: numeric('rate_amount', { precision: 12, scale: 2 }).notNull().default('0'),
  free_shipping_threshold: numeric('free_shipping_threshold', { precision: 12, scale: 2 }),
  estimated_days_min: integer('estimated_days_min'),
  estimated_days_max: integer('estimated_days_max'),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
})
