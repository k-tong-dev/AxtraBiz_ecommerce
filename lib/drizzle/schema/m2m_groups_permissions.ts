import { pgTable, uuid, timestamp, primaryKey } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { resGroups } from './res_groups'
import { resPermissions } from './res_permissions'

export const m2mGroupsPermissions = pgTable('m2m_groups_permissions', {
  groupId:      uuid('group_id').notNull().references(() => resGroups.id,      { onDelete: 'cascade' }),
  permissionId: uuid('permission_id').notNull().references(() => resPermissions.id, { onDelete: 'cascade' }),
  grantedAt:    timestamp('granted_at', { mode: 'string' }).defaultNow(),
  grantedBy:    uuid('granted_by'),
}, (t) => ({
  pk: primaryKey({ columns: [t.groupId, t.permissionId] }),
}))

export const m2mGroupsPermissionsRelations = relations(m2mGroupsPermissions, ({ one }) => ({
  group:      one(resGroups,      { fields: [m2mGroupsPermissions.groupId],      references: [resGroups.id] }),
  permission: one(resPermissions, { fields: [m2mGroupsPermissions.permissionId], references: [resPermissions.id] }),
}))

export const resGroupsM2mPermissionsRelations = relations(resGroups, ({ many }) => ({
  m2mPermissions: many(m2mGroupsPermissions),
}))

export const resPermissionsM2mGroupsRelations = relations(resPermissions, ({ many }) => ({
  m2mGroups: many(m2mGroupsPermissions),
}))

export type M2mGroupsPermission = typeof m2mGroupsPermissions.$inferSelect
export type NewM2mGroupsPermission = typeof m2mGroupsPermissions.$inferInsert
