// Export all configuration view configurations
export { configurationFormConfig, type ConfigurationFormConfig } from './formView'
export { configurationListConfig, type ConfigurationListConfig } from './listView'

import { configurationFormConfig } from './formView'
import { configurationListConfig } from './listView'
import { ServerActionConfig } from '@/components/admin/ResourceView/ServerActions'
import { Settings, Copy } from 'lucide-react'
import { createElement } from 'react'

// Centralized configuration config - Odoo-like architecture
export const configurationConfig = {
  entityName: 'Configuration',
  entityNamePlural: 'Configurations',
  apiEndpoint: '/api/configurations',

  // Default action flags - built-in actions enabled by default
  defaultActions: {
    print: false,
    exportExcel: true,
    delete: true,
    duplicate: true,
    copyJson: true,
  },

  // Custom ServerActions - additional actions beyond defaults
  customServerActions: [
    {
      key: 'duplicate_config',
      label: 'Duplicate',
      icon: createElement(Copy, { size: 16 }),
      color: 'blue' as const,
      mode: 'edit' as const,
      helper: 'Duplicate this configuration',
      onClick: async (data: any[], context?: any) => {
        const record = context?.record || data[0]
        console.log('Duplicate config:', record)
        alert('Duplicate configuration functionality - Coming soon!')
      }
    }
  ] as ServerActionConfig[],

  // View-specific configs (without actions)
  listViewConfig: (data: any[] = []) => ({
    ...configurationListConfig,
    data: data || []
  }),
  formViewConfig: configurationFormConfig,
}

// Helper to get all configs for a model (legacy support)
export const getConfigurationConfigs = (data: any[] = []) => ({
  formView: configurationFormConfig,
  listView: { ...configurationListConfig, data: data || [] },
})
