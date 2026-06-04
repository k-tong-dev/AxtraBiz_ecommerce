'use client'

import { ResourceView } from '@/components/Base/Views'
import { SettingsForm } from '../settings-form'

export default function AdminEcommerceSettingsPage() {
  return (
    <ResourceView
      config={{
        type: 'custom',
        title: 'eCommerce Settings',
        description: 'Configure store-wide e-commerce preferences, checkout, and product defaults.',
        enableDefaultActions: false,
        customView: () => (
          <SettingsForm
            settingKeys={[
              'store_name', 'store_tagline', 'store_email', 'store_phone',
              'currency_default', 'tax_default', 'checkout_require_account',
              'enable_reviews', 'enable_wishlist', 'max_cart_items',
              'low_stock_threshold', 'order_prefix',
            ]}
            title="eCommerce"
            description="Manage your online store's core e-commerce settings."
          />
        ),
      }}
    />
  )
}
