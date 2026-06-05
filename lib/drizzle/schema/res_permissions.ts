import { pgTable, serial, text } from 'drizzle-orm/pg-core'
import { auditFields } from './audit'

export const resPermissions = pgTable('res_permissions', {
  id:       serial('id').primaryKey(),
  key:      text('key').notNull().unique(),
  resource: text('resource').notNull(),
  action:   text('action').notNull(),
  ...auditFields,
})

export type ResPermission = typeof resPermissions.$inferSelect
export type NewResPermission = typeof resPermissions.$inferInsert
