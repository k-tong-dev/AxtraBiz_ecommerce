'use client'

import { ResourceView } from '@/components/Base/Views'
import { SettingsForm } from '../settings-form'

export default function AdminTelegramSettingsPage() {
  return (
    <ResourceView
      config={{
        type: 'custom',
        title: 'Telegram Bot Settings',
        description: 'Configure Telegram bot integration for notifications.',
        enableDefaultActions: false,
        customView: () => (
          <SettingsForm
            settingKeys={[
              'telegram_bot_token', 'telegram_chat_id', 'telegram_notify_new_orders',
              'telegram_notify_low_stock', 'telegram_notify_customer_signups',
            ]}
            title="Telegram Bot"
            description="Manage your Telegram bot connection and notification preferences."
          />
        ),
      }}
    />
  )
}
