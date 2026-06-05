import { pgTable, serial, text, integer, boolean } from 'drizzle-orm/pg-core'
import { paymentMethodTypeEnum } from './_enums'
import { auditColumns } from './_shared'

export const payment_methods = pgTable('payment_methods', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull(),
  type: paymentMethodTypeEnum('type').notNull(),
  card_holder_name: text('card_holder_name'),
  last4: text('last4'),
  brand: text('brand'),
  expiry_month: integer('expiry_month'),
  expiry_year: integer('expiry_year'),
  issuer: text('issuer'),
  stripe_payment_method_id: text('stripe_payment_method_id'),
  paypal_email: text('paypal_email'),
  bank_name: text('bank_name'),
  bank_account_last4: text('bank_account_last4'),
  crypto_wallet_address: text('crypto_wallet_address'),
  crypto_network: text('crypto_network'),
  is_default: boolean('is_default').default(false),
  active: boolean('active').default(true).notNull(),
  ...auditColumns,
})
