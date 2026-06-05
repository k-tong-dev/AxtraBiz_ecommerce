import { pgTable, uuid, text, jsonb } from 'drizzle-orm/pg-core'
import { auditFields } from './audit'

export const resShops = pgTable('res_shops', {
  id:      uuid('id').defaultRandom().primaryKey(),
  name:    text('name').notNull(),
  slug:    text('slug').notNull().unique(),
  domain:  text('domain'),
  company: text('company'),
  email:   text('email'),
  phone:   text('phone'),
  address: jsonb('address').default('{}'),
  logo:    jsonb('logo'),
  ...auditFields,
})

export type ResShop = typeof resShops.$inferSelect
export type NewResShop = typeof resShops.$inferInsert
