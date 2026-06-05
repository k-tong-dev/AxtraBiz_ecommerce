import { pgTable, serial, text, jsonb, numeric, boolean, integer } from 'drizzle-orm/pg-core'
import { auditColumns } from './_shared'

export const shipping_zones = pgTable('shipping_zones', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id'),
  name: text('name').notNull(),
  description: text('description'),
  countries: jsonb('countries').notNull().default('[]'),
  regions: jsonb('regions').notNull().default('[]'),
  base_rate: numeric('base_rate', { precision: 12, scale: 2 }).default('0'),
  free_shipping_threshold: numeric('free_shipping_threshold', { precision: 12, scale: 2 }),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
})
