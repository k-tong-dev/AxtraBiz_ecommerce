import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core'
import { attributeTypeEnum } from './_enums'
import { auditColumns } from './_shared'
import { resShops } from './res_shops'

export const product_attributes = pgTable('product_attributes', {
  id: serial('id').primaryKey(),
  shopId: integer('shop_id').references(() => resShops.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  type: attributeTypeEnum('type').notNull().default('select'),
  position: integer('position').default(0),
  ...auditColumns,
})
