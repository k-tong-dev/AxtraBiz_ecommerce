// Export all order view configurations
export { orderFormConfig, type OrderFormConfig } from './formView'
export { orderListConfig, type OrderListConfig } from './listView'

import { orderFormConfig } from './formView'
import { orderListConfig } from './listView'
import { ServerActionConfig } from '../../../../components/Base/Actions'
import { Package, Truck } from 'lucide-react'
import { createElement } from 'react'

// Centralized order config - Odoo-like architecture
export const orderConfig = {
  entityName: 'Order',
  entityNamePlural: 'Orders',
  apiEndpoint: '/api/admin/orders',

  // Default action flags - built-in actions enabled by default
  defaultActions: {
    print: true,
    exportExcel: true,
    delete: true,
    duplicate: false,
    copyJson: true,
    archive: true,
    unarchive: true,
  },

  // Custom ServerActions - additional actions beyond defaults
  customServerActions: [
    {
      key: 'update_tracking',
      label: 'Update Tracking',
      icon: createElement(Truck, { size: 16 }),
      color: 'blue' as const,
      mode: 'edit' as const,
      helper: 'Update tracking number for this order',
      onClick: async (data: any[], context?: any) => {
        const record = context?.record || data[0]
        console.log('Update tracking for:', record)
        alert('Update tracking functionality - Coming soon!')
      }
    },
    {
      key: 'print_invoice',
      label: 'Print Invoice',
      icon: createElement(Package, { size: 16 }),
      color: 'violet' as const,
      mode: 'both' as const,
      helper: 'Print invoice for this order',
      onClick: async (data: any[], context?: any) => {
        const record = context?.record || data[0]
        console.log('Print invoice for:', record)
        alert('Print invoice functionality - Coming soon!')
      }
    }
  ] as ServerActionConfig[],

  // View-specific configs (without actions)
  listViewConfig: (data: any[] = []) => ({
    ...orderListConfig,
    data: data || []
  }),
  formViewConfig: orderFormConfig,
}

// Helper to get all configs for a model (legacy support)
export const getOrderConfigs = (data: any[] = []) => ({
  formView: orderFormConfig,
  listView: { ...orderListConfig, data: data || [] },
})
