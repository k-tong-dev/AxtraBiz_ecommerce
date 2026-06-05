import { pgTable, serial, text, numeric, integer, boolean } from 'drizzle-orm/pg-core'
import { auditColumns } from './_shared'

export const tax_rates = pgTable('tax_rates', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id'),
  name: text('name').notNull(),
  rate: numeric('rate', { precision: 5, scale: 2 }).notNull(),
  country: text('country').notNull(),
  region: text('region'),
  postal_code: text('postal_code'),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
})
