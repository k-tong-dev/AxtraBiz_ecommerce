import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core'
import { settingCategoryEnum } from './_enums'
import { auditColumns } from './_shared'

export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  shop_id: integer('shop_id'),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  category: settingCategoryEnum('category').notNull().default('general'),
  ...auditColumns,
})
