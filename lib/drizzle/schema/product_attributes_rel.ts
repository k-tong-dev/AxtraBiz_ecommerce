import { pgTable, serial, integer } from 'drizzle-orm/pg-core'
import { timestamps } from './_shared'
import { product_template } from './product_template'
import { product_attributes } from './product_attributes'

export const product_attributes_rel = pgTable('product_attributes_rel', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').notNull().references(() => product_template.id, { onDelete: 'cascade' }),
  attribute_id: integer('attribute_id').notNull().references(() => product_attributes.id, { onDelete: 'cascade' }),
  position: integer('position').default(0),
  ...timestamps,
})
