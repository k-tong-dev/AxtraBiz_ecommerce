import { pgTable, serial, text, integer, boolean } from 'drizzle-orm/pg-core'
import { auditColumns } from './_shared'
import { product_attributes } from './product_attributes'

export const product_attribute_values = pgTable('product_attribute_values', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  value: text('value').notNull(),
  attribute_id: integer('attribute_id').references(() => product_attributes.id, { onDelete: 'set null' }),
  position: integer('position').default(0),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
})
