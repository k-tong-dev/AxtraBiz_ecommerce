import { pgTable, uuid, boolean, timestamp, primaryKey } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { resUsers } from '../schema/res_users'
import { resShops } from '../schema/res_shops'

export const m2mUsersShops = pgTable('m2m_users_shops', {
  userId:     uuid('user_id').notNull().references(() => resUsers.id, { onDelete: 'cascade' }),
  shopId:     uuid('shop_id').notNull().references(() => resShops.id, { onDelete: 'cascade' }),
  isDefault:  boolean('is_default').default(false),
  assignedAt: timestamp('assigned_at', { mode: 'string' }).defaultNow(),
  assignedBy: uuid('assigned_by').references(() => resUsers.id, { onDelete: 'set null' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.shopId] }),
}))

export const m2mUsersShopsRelations = relations(m2mUsersShops, ({ one }) => ({
  user: one(resUsers, { fields: [m2mUsersShops.userId], references: [resUsers.id] }),
  shop: one(resShops, { fields: [m2mUsersShops.shopId], references: [resShops.id] }),
}))

export type M2mUsersShop = typeof m2mUsersShops.$inferSelect
export type NewM2mUsersShop = typeof m2mUsersShops.$inferInsert
