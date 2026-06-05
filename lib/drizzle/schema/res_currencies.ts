import { pgTable, text, integer, numeric, boolean } from 'drizzle-orm/pg-core'
import { auditColumns } from './_shared'

export const currencies = pgTable('res_currencies', {
  code: text('code').primaryKey(),
  name: text('name').notNull(),
  symbol: text('symbol').notNull(),
  decimal_places: integer('decimal_places').notNull().default(2),
  exchange_rate: numeric('exchange_rate', { precision: 14, scale: 6 }).notNull().default('1'),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
})
