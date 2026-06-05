import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core'
import { product_template } from './product_template'
import { product_variants } from './product_variants'

export const cart_items = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  user_id: text('user_id'),
  session_id: text('session_id'),
  product_id: integer('product_id').notNull().references(() => product_template.id, { onDelete: 'cascade' }),
  variant_id: integer('variant_id').references(() => product_variants.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
  created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
})
