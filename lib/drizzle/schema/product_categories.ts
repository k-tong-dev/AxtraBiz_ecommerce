import { pgTable, serial, text, integer, jsonb, boolean } from 'drizzle-orm/pg-core'
import { auditColumns } from './_shared'
import { resShops } from './res_shops'

export const product_categories = pgTable('product_categories', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id').references(() => resShops.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  parent_id: integer('parent_id').references(() => product_categories.id, { onDelete: 'set null' }),
  image_id: jsonb('image_id'),
  position: integer('position').default(0),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
}) as any

export type ProductCategory = typeof product_categories.$inferSelect
