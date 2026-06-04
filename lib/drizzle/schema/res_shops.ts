import { pgTable, serial, text, jsonb, boolean, timestamp } from 'drizzle-orm/pg-core'

export const resShops = pgTable('res_shops', {
  id:        serial('id').primaryKey(),
  name:      text('name').notNull(),
  slug:      text('slug').notNull().unique(),
  domain:    text('domain'),
  company:   text('company'),
  email:     text('email'),
  phone:     text('phone'),
  address:   jsonb('address').default('{}'),
  logo:      jsonb('logo'),
  active:    boolean('active').notNull().default(true),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
})

export type ResShop = typeof resShops.$inferSelect
export type NewResShop = typeof resShops.$inferInsert
