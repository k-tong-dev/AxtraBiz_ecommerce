import { pgTable, uuid, timestamp, primaryKey } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { resUsers } from './res_users'
import { resGroups } from './res_groups'

export const m2mUsersGroups = pgTable('m2m_users_groups', {
  userId:     uuid('user_id').notNull().references(() => resUsers.id, { onDelete: 'cascade' }),
  groupId:    uuid('group_id').notNull().references(() => resGroups.id, { onDelete: 'cascade' }),
  assignedAt: timestamp('assigned_at', { mode: 'string' }).defaultNow(),
  assignedBy: uuid('assigned_by'),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.groupId] }),
}))

export const m2mUsersGroupsRelations = relations(m2mUsersGroups, ({ one }) => ({
  user:  one(resUsers,  { fields: [m2mUsersGroups.userId],  references: [resUsers.id] }),
  group: one(resGroups, { fields: [m2mUsersGroups.groupId], references: [resGroups.id] }),
}))

export const resUsersM2mGroupsRelations = relations(resUsers, ({ many }) => ({
  m2mGroups: many(m2mUsersGroups),
}))

export const resGroupsM2mUsersRelations = relations(resGroups, ({ many }) => ({
  m2mUsers: many(m2mUsersGroups),
}))

export type M2mUsersGroup = typeof m2mUsersGroups.$inferSelect
export type NewM2mUsersGroup = typeof m2mUsersGroups.$inferInsert
