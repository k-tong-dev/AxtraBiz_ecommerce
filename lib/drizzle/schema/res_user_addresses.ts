import { pgTable, serial, uuid, text, boolean } from 'drizzle-orm/pg-core'
import { addressTypeEnum } from './_enums'
import { auditColumns } from './_shared'
import { resUsers } from './res_users'

export const resUserAddresses = pgTable('res_user_addresses', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => resUsers.id, { onDelete: 'cascade' }),
  type: addressTypeEnum('type').notNull().default('shipping'),
  name: text('name').notNull(),
  street: text('street').notNull(),
  street2: text('street2'),
  city: text('city').notNull(),
  state: text('state'),
  postalCode: text('postal_code').notNull(),
  country: text('country').notNull().default('US'),
  phone: text('phone'),
  isDefault: boolean('is_default').default(false),
  ...auditColumns,
})

export type ResUserAddress = typeof resUserAddresses.$inferSelect;
export type NewResUserAddress = typeof resUserAddresses.$inferInsert;
