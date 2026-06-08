import { pgTable, serial, text, integer, numeric } from 'drizzle-orm/pg-core'
import { timestamps } from './_shared'
import { orders } from './orders'
import { order_lines } from './order_lines'
import { product_variants } from './product_variants'
import { returnStatusEnum } from './_enums'
import {auditFields} from "@/lib/drizzle/schema/audit";

export const return_requests = pgTable('return_requests', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  order_line_id: integer('order_line_id').notNull().references(() => order_lines.id, { onDelete: 'cascade' }),
  variant_id: integer('variant_id').references(() => product_variants.id, { onDelete: 'set null' }),
  user_id: text('user_id').notNull(),
  quantity: integer('quantity').notNull().default(1),
  reason: text('reason'),
  status: returnStatusEnum('status').notNull().default('pending'),
  refund_amount: numeric('refund_amount', { precision: 12, scale: 2 }).default('0'),
  ...auditFields,
})
