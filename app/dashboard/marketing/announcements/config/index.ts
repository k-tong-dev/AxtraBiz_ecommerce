// Export all announcement view configurations
export { announcementFormConfig, type AnnouncementFormConfig } from './formView'
export { announcementListConfig, type AnnouncementListConfig } from './listView'

import { announcementFormConfig } from './formView'
import { announcementListConfig } from './listView'
import { ServerActionConfig } from '@/components/Base/Actions'
import { Megaphone, Copy } from 'lucide-react'
import { createElement } from 'react'

// Centralized announcement config - Odoo-like architecture
export const announcementConfig = {
  entityName: 'Announcement',
  entityNamePlural: 'Announcements',
  apiEndpoint: '/api/dashboard/announcements',

  // Default action flags - built-in actions enabled by default
  defaultActions: {
    print: true,
    exportExcel: true,
    delete: true,
    duplicate: true,
    copyJson: true,
    archive: true,
    unarchive: true,
  },

  // Custom ServerActions - additional actions beyond defaults
  customServerActions: [
    {
      key: 'duplicate_announcement',
      label: 'Duplicate',
      icon: createElement(Copy, { size: 16 }),
      color: 'blue' as const,
      mode: 'edit' as const,
      helper: 'Duplicate this announcement',
      onClick: async (data: any[], context?: any) => {
        const record = context?.record || data[0]
        console.log('Duplicate Announcement:', record)
        alert('Duplicate functionality - Coming soon!')
      }
    }
  ] as ServerActionConfig[],

  // View-specific configs (without actions)
  listViewConfig: (data: any[] = []) => ({
    ...announcementListConfig,
    data: data || []
  }),
  formViewConfig: announcementFormConfig,
}

// Helper to get all configs for a model (legacy support)
export const getAnnouncementConfigs = (data: any[] = []) => ({
  formView: announcementFormConfig,
  listView: { ...announcementListConfig, data: data || [] },
})
