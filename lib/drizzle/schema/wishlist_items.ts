import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core'
import { product_template } from './product_template'
import { product_variants } from './product_variants'

export const wishlist_items = pgTable('wishlist_items', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull(),
  product_id: integer('product_id').notNull().references(() => product_template.id, { onDelete: 'cascade' }),
  variant_id: integer('variant_id').references(() => product_variants.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
})
