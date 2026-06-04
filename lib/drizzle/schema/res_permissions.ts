import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

export const resPermissions = pgTable('res_permissions', {
  id:        uuid('id').defaultRandom().primaryKey(),
  key:       text('key').notNull().unique(),
  resource:  text('resource').notNull(),
  action:    text('action').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
})

export type ResPermission = typeof resPermissions.$inferSelect
export type NewResPermission = typeof resPermissions.$inferInsert
