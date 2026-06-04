import { pgTable, uuid, integer, text, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core'

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
  shopId:      integer('shop_id'),
  active:      boolean('active').notNull().default(true),
  createdAt:   timestamp('created_at', { mode: 'string' }).defaultNow(),
  updatedAt:   timestamp('updated_at', { mode: 'string' }).defaultNow(),
  createdBy:   uuid('created_by'),
  updatedBy:   uuid('updated_by'),
})

export type ResUser = typeof resUsers.$inferSelect
export type NewResUser = typeof resUsers.$inferInsert
