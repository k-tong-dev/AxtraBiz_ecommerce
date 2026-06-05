import { pgTable, serial, text, jsonb } from 'drizzle-orm/pg-core'
import { auditActionEnum, auditSeverityEnum } from './_enums'
import { timestamps } from './_shared'

export const audit_logs = pgTable('ir_audit_logs', {
  id: serial('id').primaryKey(),
  user_id: text('user_id'),
  action: auditActionEnum('action').notNull().default('create'),
  entity_type: text('entity_type').notNull(),
  entity_id: text('entity_id'),
  details: jsonb('details').default('{}'),
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
  severity: auditSeverityEnum('severity').notNull().default('info'),
  ...timestamps,
})
