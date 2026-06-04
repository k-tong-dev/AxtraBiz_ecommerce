import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core'

export const resGroups = pgTable('res_groups', {
  id:          uuid('id').defaultRandom().primaryKey(),
  name:        text('name').notNull(),
  description: text('description'),
  active:      boolean('active').notNull().default(true),
  createdAt:   timestamp('created_at', { mode: 'string' }).defaultNow(),
  updatedAt:   timestamp('updated_at', { mode: 'string' }).defaultNow(),
})

export type ResGroup = typeof resGroups.$inferSelect
export type NewResGroup = typeof resGroups.$inferInsert
