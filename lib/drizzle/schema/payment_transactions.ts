import { pgTable, serial, text, timestamp, numeric, integer } from 'drizzle-orm/pg-core'
import { paymentMethodEnum, transactionStatusEnum } from './_enums'
import { auditColumns } from './_shared'
import { orders } from './orders'
import { invoices } from './invoices'

export const payment_transactions = pgTable('payment_transactions', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').notNull().references(() => orders.id, { onDelete: 'restrict' }),
  invoice_id: integer('invoice_id').references(() => invoices.id, { onDelete: 'set null' }),
  user_id: text('user_id').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull().default('0'),
  currency: text('currency').notNull().default('USD'),
  payment_method: paymentMethodEnum('payment_method').notNull().default('stripe'),
  status: transactionStatusEnum('status').notNull().default('pending'),
  transaction_id: text('transaction_id'),
  paid_at: timestamp('paid_at', { mode: 'string' }),
  ...auditColumns,
})
