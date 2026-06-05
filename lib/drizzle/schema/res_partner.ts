import { pgTable, uuid, text, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const partnerTypeEnum = pgEnum('partner_type', ['contact', 'customer', 'vendor'])

export const resPartner = pgTable('res_partner', {
  id:        uuid('id').defaultRandom().primaryKey(),
  shopId:    uuid('shop_id').notNull(),
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
  active:    boolean('active').notNull().default(true),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
  createdBy: uuid('created_by'),
  updatedBy: uuid('updated_by'),
})

export type ResPartner = typeof resPartner.$inferSelect
export type NewResPartner = typeof resPartner.$inferInsert
