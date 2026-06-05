import { pgTable, serial, text, jsonb, boolean } from 'drizzle-orm/pg-core'
import { auditFields } from './audit'

export const resShops = pgTable('res_shops', {
  id:      serial('id').primaryKey(),
  name:    text('name').notNull(),
  slug:    text('slug').notNull().unique(),
  domain:  text('domain'),
  company: text('company'),
  email:   text('email'),
  phone:   text('phone'),
  address: jsonb('address').default('{}'),
  logo:    jsonb('logo'),

  defaultCurrency: text('default_currency').default('USD'),
  timezone:        text('timezone').default('Asia/Phnom_Penh'),
  language:        text('language').default('en'),
  logoUrl:         text('logo_url'),

  // Features toggle (like Odoo module enable/disable)
  enableOtp:       boolean('enable_otp').default(true),
  enableReviews:   boolean('enable_reviews').default(true),
  enableCoupons:   boolean('enable_coupons').default(false),

  // Notifications
  smtpHost:        text('smtp_host'),
  smtpPort:        text('smtp_port'),
  supportEmail:    text('support_email'),

  ...auditFields,
})

export type ResShop = typeof resShops.$inferSelect
export type NewResShop = typeof resShops.$inferInsert
