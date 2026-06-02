'use client'

import { ResourceView } from '@/components/Base/Views'
import { SettingsForm } from '../settings-form'

export default function AdminPhoneSettingsPage() {
  return (
    <ResourceView
      config={{
        type: 'custom',
        title: 'Global Phone Number Settings',
        description: 'Configure global contact numbers and phone verification.',
        enableDefaultActions: false,
        customView: () => (
          <SettingsForm
            settingKeys={[
              'global_phone', 'global_phone_toll_free', 'support_phone',
              'whatsapp_number', 'enable_phone_verification',
              'sms_provider', 'sms_api_key', 'sms_from_number',
            ]}
            title="Global Phone"
            description="Manage your store's phone numbers and SMS configuration."
          />
        ),
      }}
    />
  )
}
