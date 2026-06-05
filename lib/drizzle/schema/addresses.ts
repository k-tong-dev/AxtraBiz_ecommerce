import { pgTable, serial, text, boolean, integer } from 'drizzle-orm/pg-core'
import { addressTypeEnum } from './_enums'
import { auditColumns } from './_shared'

export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull(),
  type: addressTypeEnum('type').notNull().default('shipping'),
  name: text('name').notNull(),
  street: text('street').notNull(),
  street2: text('street2'),
  city: text('city').notNull(),
  state: text('state'),
  postal_code: text('postal_code').notNull(),
  country: text('country').notNull().default('US'),
  phone: text('phone'),
  is_default: boolean('is_default').default(false),
  ...auditColumns,
})
