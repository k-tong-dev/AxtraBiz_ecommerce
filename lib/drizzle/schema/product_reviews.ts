import { pgTable, serial, text, integer, boolean } from 'drizzle-orm/pg-core'
import { auditColumns } from './_shared'
import { product_template } from './product_template'
import { product_variants } from './product_variants'

export const product_reviews = pgTable('product_reviews', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull(),
  product_id: integer('product_id').notNull().references(() => product_template.id, { onDelete: 'cascade' }),
  variant_id: integer('variant_id').references(() => product_variants.id, { onDelete: 'set null' }),
  rating: integer('rating').notNull().default(5),
  title: text('title'),
  body: text('body'),
  approved: boolean('approved').default(false),
  ...auditColumns,
})
