import { boolean, timestamp, uuid } from 'drizzle-orm/pg-core'

export const auditFields = {
  active:    boolean('active').notNull().default(true),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow(),
  createdBy: uuid('created_by'),
  updatedBy: uuid('updated_by'),
}
