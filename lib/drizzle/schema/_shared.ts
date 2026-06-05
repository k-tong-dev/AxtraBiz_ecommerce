import { timestamp, uuid } from 'drizzle-orm/pg-core'

export const auditColumns = {
  created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
  create_uid: uuid('create_uid'),
  write_uid: uuid('write_uid'),
}

export const timestamps = {
  created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
}
