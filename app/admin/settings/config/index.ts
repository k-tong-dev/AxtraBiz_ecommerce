// Export all setting view configurations
export { settingFormConfig, type SettingFormConfig } from './formView'
export { settingListConfig, type SettingListConfig } from './listView'

import { settingFormConfig } from './formView'
import { settingListConfig } from './listView'
import { ServerActionConfig } from '../../../../components/Base/Actions'
import { Settings, Copy } from 'lucide-react'
import { createElement } from 'react'

// Centralized setting config - Odoo-like architecture
export const settingConfig = {
  entityName: 'Setting',
  entityNamePlural: 'Settings',
  apiEndpoint: '/api/admin/settings',

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
      key: 'duplicate_setting',
      label: 'Duplicate',
      icon: createElement(Copy, { size: 16 }),
      color: 'blue' as const,
      mode: 'edit' as const,
      helper: 'Duplicate this setting',
      onClick: async (data: any[], context?: any) => {
        const record = context?.record || data[0]
        console.log('Duplicate setting:', record)
        alert('Duplicate setting functionality - Coming soon!')
      }
    }
  ] as ServerActionConfig[],

  // View-specific configs (without actions)
  listViewConfig: (data: any[] = []) => ({
    ...settingListConfig,
    data: data || []
  }),
  formViewConfig: settingFormConfig,
}

// Helper to get all configs for a model (legacy support)
export const getSettingConfigs = (data: any[] = []) => ({
  formView: settingFormConfig,
  listView: { ...settingListConfig, data: data || [] },
})
