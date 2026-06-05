import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core'
import { attributeTypeEnum } from './_enums'
import { auditColumns } from './_shared'

export const product_attributes = pgTable('product_attributes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: attributeTypeEnum('type').notNull().default('select'),
  position: integer('position').default(0),
  ...auditColumns,
})
