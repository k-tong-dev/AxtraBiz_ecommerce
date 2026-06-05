import { pgTable, serial, text, integer, jsonb, boolean, numeric } from 'drizzle-orm/pg-core'
import { auditColumns, timestamps } from './_shared'
import { shipping_zones } from './shipping_zones'
import { product_template } from './product_template'

export const shipping_zone_product = pgTable('shipping_zone_product', {
  id: serial('id').primaryKey(),
  shipping_zone_id: integer('shipping_zone_id').notNull().references(() => shipping_zones.id, { onDelete: 'cascade' }),
  product_id: integer('product_id').notNull().references(() => product_template.id, { onDelete: 'cascade' }),
  custom_rate: numeric('custom_rate', { precision: 12, scale: 2 }),
  active: boolean('active').default(true).notNull(),
  ...timestamps,
})
