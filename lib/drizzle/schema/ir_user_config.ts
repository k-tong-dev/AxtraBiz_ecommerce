import { pgTable, uuid, text, boolean, integer } from 'drizzle-orm/pg-core'
import { auditColumns } from './_shared'
import { resUsers } from './res_users'

export const irUserConfig = pgTable('ir_user_config', {
  userId: uuid('user_id').primaryKey().notNull().references(() => resUsers.id, { onDelete: 'cascade' }),
  // Telegram
  telegramEnabled: boolean('telegram_enabled').default(false),
  telegramBotToken: text('telegram_bot_token'),
  telegramChatId: text('telegram_chat_id'),
  telegramNotifyOrder: boolean('telegram_notify_order').default(true),
  telegramNotifyStock: boolean('telegram_notify_stock').default(false),
  // SMS
  smsEnabled: boolean('sms_enabled').default(false),
  smsProvider: text('sms_provider'),
  smsApiKey: text('sms_api_key'),
  smsApiSecret: text('sms_api_secret'),
  smsSenderId: text('sms_sender_id'),
  // Payment
  paymentEnabled: boolean('payment_enabled').default(false),
  paymentProvider: text('payment_provider'),
  paymentApiKey: text('payment_api_key'),
  paymentApiSecret: text('payment_api_secret'),
  paymentDefaultMethod: text('payment_default_method'),
  paymentWebhookUrl: text('payment_webhook_url'),
  // Warehouse
  warehouseEnabled: boolean('warehouse_enabled').default(false),
  warehouseMulti: boolean('warehouse_multi').default(false),
  warehouseLowStockQty: integer('warehouse_low_stock_qty').default(5),
  // Notifications
  notifyOrderCreated: boolean('notify_order_created').default(true),
  notifyOrderPaid: boolean('notify_order_paid').default(true),
  notifyLowStock: boolean('notify_low_stock').default(false),
  ...auditColumns,
})

export type IrUserConfig = typeof irUserConfig.$inferSelect;
export type NewIrUserConfig = typeof irUserConfig.$inferInsert;
