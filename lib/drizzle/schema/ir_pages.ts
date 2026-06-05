import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core'
import { pageStatusEnum } from './_enums'
import { auditColumns } from './_shared'

export const pages = pgTable('ir_pages', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id'),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  content: text('content'),
  meta_title: text('meta_title'),
  meta_description: text('meta_description'),
  status: pageStatusEnum('status').notNull().default('draft'),
  published_at: timestamp('published_at', { mode: 'string' }),
  ...auditColumns,
})
