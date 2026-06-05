import { pgTable, serial, integer, text, jsonb, boolean } from 'drizzle-orm/pg-core'
import { auditColumns } from './_shared'
import { resShops } from './res_shops'

export const menus = pgTable('ir_menus', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  shopId: integer('shop_id').references(() => resShops.id, { onDelete: 'set null' }),
  slug: text('slug').notNull().unique(),
  items: jsonb('items').notNull().default('[]'),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
})
