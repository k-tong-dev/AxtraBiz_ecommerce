import { pgTable, serial, text, jsonb, boolean } from 'drizzle-orm/pg-core'
import { auditColumns } from './_shared'

export const menus = pgTable('ir_menus', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  items: jsonb('items').notNull().default('[]'),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
})
