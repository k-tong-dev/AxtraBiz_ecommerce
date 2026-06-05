import { pgTable, serial, text } from 'drizzle-orm/pg-core'
import { configTypeEnum, configCategoryEnum } from './_enums'
import { auditColumns } from './_shared'

export const configurations = pgTable('configurations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  value: text('value').notNull(),
  type: configTypeEnum('type').notNull().default('string'),
  category: configCategoryEnum('category').notNull().default('general'),
  ...auditColumns,
})
