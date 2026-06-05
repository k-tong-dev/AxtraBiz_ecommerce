import { pgTable, serial, text, timestamp, jsonb, numeric, integer } from 'drizzle-orm/pg-core'
import { invoiceStatusEnum } from './_enums'
import { auditColumns } from './_shared'
import { orders } from './orders'

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').notNull().references(() => orders.id, { onUpdate: 'cascade', onDelete: 'restrict' }),
  invoice_number: text('invoice_number').notNull().unique(),
  user_id: text('user_id').notNull(),
  items: jsonb('items').notNull().default('[]'),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull().default('0'),
  tax: numeric('tax', { precision: 12, scale: 2 }).notNull().default('0'),
  total: numeric('total', { precision: 12, scale: 2 }).notNull().default('0'),
  status: invoiceStatusEnum('status').notNull().default('draft'),
  due_date: timestamp('due_date', { mode: 'string' }),
  ...auditColumns,
})
