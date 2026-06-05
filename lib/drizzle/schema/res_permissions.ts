import { pgTable, uuid, text } from 'drizzle-orm/pg-core'
import { auditFields } from './audit'

export const resPermissions = pgTable('res_permissions', {
  id:       uuid('id').defaultRandom().primaryKey(),
  key:      text('key').notNull().unique(),
  resource: text('resource').notNull(),
  action:   text('action').notNull(),
  ...auditFields,
})

export type ResPermission = typeof resPermissions.$inferSelect
export type NewResPermission = typeof resPermissions.$inferInsert
