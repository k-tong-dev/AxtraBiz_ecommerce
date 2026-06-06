import { pgTable, uuid, integer, text, boolean, pgEnum, foreignKey } from 'drizzle-orm/pg-core'
import { auditFields } from './audit'
import { resShops } from './res_shops'

export const userRoleEnum = pgEnum('user_role', ['_admin_system_', 'employee', 'business', 'new'])

export const resUsers = pgTable('res_users', {
  id:          uuid('id').defaultRandom().primaryKey(),
  authUserId:  uuid('auth_user_id'),
  username:    text('username').notNull().unique(),
  displayName: text('display_name'),
  avatarUrl:   text('avatar_url'),
  phone:       text('phone'),
  country:     text('country'),
  email:       text('email').notNull(),
  userRole:    userRoleEnum('user_role').notNull().default('new'),
  isShopOwner: boolean('is_shop_owner').notNull().default(false),
  isVerified:  boolean('is_verified').notNull().default(false),
  shopId:      integer('shop_id').references(() => resShops.id, { onDelete: 'set null' }),
  ...auditFields,
}, (t) => ({
  authUserFk: foreignKey({ columns: [t.authUserId], foreignColumns: [t.id] }).onDelete('set null'),
}))

export type ResUser = typeof resUsers.$inferSelect
export type NewResUser = typeof resUsers.$inferInsert
