'use client'

import { ResourceView } from '@/components/Base/Views'
import { SettingsForm } from '../settings-form'

export default function AdminLocationSettingsPage() {
  return (
    <ResourceView
      config={{
        type: 'custom',
        title: 'Location Settings',
        description: 'Configure store location, timezone, and regional preferences.',
        enableDefaultActions: false,
        customView: () => (
          <SettingsForm
            settingKeys={['store_country', 'store_city', 'store_address', 'store_zip', 'timezone', 'currency_default', 'language_default']}
            title="Location"
            description="Manage your store's location and regional settings."
          />
        ),
      }}
    />
  )
}
