import { pgTable, uuid, text } from 'drizzle-orm/pg-core'
import { auditFields } from './audit'

export const resGroups = pgTable('res_groups', {
  id:          uuid('id').defaultRandom().primaryKey(),
  name:        text('name').notNull(),
  description: text('description'),
  ...auditFields,
})

export type ResGroup = typeof resGroups.$inferSelect
export type NewResGroup = typeof resGroups.$inferInsert
