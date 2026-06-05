import { pgTable, serial, integer, text, boolean, pgEnum } from 'drizzle-orm/pg-core'
import { auditFields } from './audit'
import { resShops } from './res_shops'

export const partnerTypeEnum = pgEnum('partner_type', ['contact', 'customer', 'vendor'])

export const resPartner = pgTable('res_partner', {
  id:        serial('id').primaryKey(),
  shopId:    integer('shop_id').notNull().references(() => resShops.id),
  name:      text('name').notNull(),
  email:     text('email'),
  phone:     text('phone'),
  avatarUrl: text('avatar_url'),
  isCompany: boolean('is_company').notNull().default(false),
  type:      partnerTypeEnum('type').notNull().default('contact'),
  street:    text('street'),
  street2:   text('street2'),
  city:      text('city'),
  state:     text('state'),
  zip:       text('zip'),
  country:   text('country'),
  website:   text('website'),
  lang:      text('lang'),
  vat:       text('vat'),
  ref:       text('ref'),
  comment:   text('comment'),
  ...auditFields,
})

export type ResPartner = typeof resPartner.$inferSelect
export type NewResPartner = typeof resPartner.$inferInsert
