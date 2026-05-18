// Export all customer view configurations
export { customerFormConfig, type CustomerFormConfig } from './formView'
export { customerListConfig, type CustomerListConfig } from './listView'

import { customerFormConfig } from './formView'
import { customerListConfig } from './listView'
import { ServerActionConfig } from '../../../../components/Base/Actions'
import { User, Copy, Mail } from 'lucide-react'
import { createElement } from 'react'

// Centralized customer config - Odoo-like architecture
export const customerConfig = {
  entityName: 'Customer',
  entityNamePlural: 'Customers',
  apiEndpoint: '/api/users',

  // Default action flags - built-in actions enabled by default
  defaultActions: {
    print: true,
    exportExcel: true,
    delete: true,
    duplicate: false,
    copyJson: true,
  },

  // Custom ServerActions - additional actions beyond defaults
  customServerActions: [
    {
      key: 'send_email',
      label: 'Send Email',
      icon: createElement(Mail, { size: 16 }),
      color: 'blue' as const,
      mode: 'edit' as const,
      helper: 'Send email to this customer',
      onClick: async (data: any[], context?: any) => {
        const record = context?.record || data[0]
        console.log('Send email to:', record)
        alert('Send email functionality - Coming soon!')
      }
    },
    {
      key: 'duplicate_customer',
      label: 'Duplicate',
      icon: createElement(Copy, { size: 16 }),
      color: 'violet' as const,
      mode: 'edit' as const,
      helper: 'Duplicate this customer record',
      onClick: async (data: any[], context?: any) => {
        const record = context?.record || data[0]
        console.log('Duplicate customer:', record)
        alert('Duplicate customer functionality - Coming soon!')
      }
    }
  ] as ServerActionConfig[],

  // View-specific configs (without actions)
  listViewConfig: (data: any[] = []) => ({
    ...customerListConfig,
    data: data || []
  }),
  formViewConfig: customerFormConfig,
}

// Helper to get all configs for a model (legacy support)
export const getCustomerConfigs = (data: any[] = []) => ({
  formView: customerFormConfig,
  listView: { ...customerListConfig, data: data || [] },
})
