import { timestamp, text } from 'drizzle-orm/pg-core'

export const auditColumns = {
  created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
  create_uid: text('create_uid'),
  write_uid: text('write_uid'),
}

export const timestamps = {
  created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
}
