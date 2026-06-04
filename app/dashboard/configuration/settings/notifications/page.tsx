'use client'

import { ResourceView } from '@/components/Base/Views'
import { SettingsForm } from '../settings-form'

export default function AdminNotificationSettingsPage() {
  return (
    <ResourceView
      config={{
        type: 'custom',
        title: 'Notification Settings',
        description: 'Configure email, push, and in-app notification preferences.',
        enableDefaultActions: false,
        customView: () => (
          <SettingsForm
            settingKeys={[
              'notify_new_orders_email', 'notify_new_orders_push',
              'notify_low_stock_email', 'notify_low_stock_push',
              'notify_customer_signups', 'notify_reviews',
              'email_order_confirmation', 'email_shipping_update',
              'email_password_reset', 'email_marketing_opt_in',
              'push_notifications_enabled',
            ]}
            title="Notifications"
            description="Manage notification channels and event triggers."
          />
        ),
      }}
    />
  )
}
