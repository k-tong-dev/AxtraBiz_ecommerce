import { pgTable, serial, text, integer, jsonb, boolean } from 'drizzle-orm/pg-core'
import { auditColumns } from './_shared'

export const product_brand = pgTable('product_brand', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id'),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  image_id: jsonb('image_id'),
  website: text('website'),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
})
