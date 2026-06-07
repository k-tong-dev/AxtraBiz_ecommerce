import { pgTable, text, varchar } from 'drizzle-orm/pg-core'
import { auditColumns } from './_shared'

export const resCountries = pgTable('res_country', {
  code: varchar('code', { length: 2 }).primaryKey(),
  name: text('name').notNull(),
  flag: text('flag').notNull(),
  phoneCode: varchar('phone_code', { length: 10 }),
  ...auditColumns,
})

export type ResCountry = typeof resCountries.$inferSelect
export type NewResCountry = typeof resCountries.$inferInsert
