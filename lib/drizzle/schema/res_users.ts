import { pgTable, uuid, text, boolean, pgEnum } from 'drizzle-orm/pg-core'
import { auditFields } from './audit'

export const userRoleEnum = pgEnum('user_role', ['_admin_system_', 'employee', 'business', 'new'])

export const resUsers = pgTable('res_users', {
  id:          uuid('id').defaultRandom().primaryKey(),
  authUserId:  uuid('auth_user_id').notNull().unique(),
  username:    text('username').notNull().unique(),
  displayName: text('display_name'),
  avatarUrl:   text('avatar_url'),
  phone:       text('phone'),
  email:       text('email').notNull(),
  userRole:    userRoleEnum('user_role').notNull().default('new'),
  isShopOwner: boolean('is_shop_owner').notNull().default(false),
  shopId:      uuid('shop_id'),
  ...auditFields,
})

export type ResUser = typeof resUsers.$inferSelect
export type NewResUser = typeof resUsers.$inferInsert
