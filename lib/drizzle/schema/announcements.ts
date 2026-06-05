import { pgTable, serial, text, boolean, timestamp, jsonb, integer } from 'drizzle-orm/pg-core'
import { announcementTypeEnum } from './_enums'
import { auditColumns } from './_shared'

export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id'),
  title: text('title').notNull(),
  content: text('content').notNull(),
  type: announcementTypeEnum('type').notNull().default('info'),
  active: boolean('active').notNull().default(true),
  start_date: timestamp('start_date', { mode: 'string' }),
  end_date: timestamp('end_date', { mode: 'string' }),
  ...auditColumns,
})
