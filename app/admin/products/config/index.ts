// Export all product view configurations
export { productFormConfig, type ProductFormConfig } from './formView'
export { getProductListConfig } from './listView'
export { getProductGanttConfig } from './ganttView'
export { getProductKanbanConfig } from './kanbanView'

import { productFormConfig } from './formView'
import { getProductListConfig } from './listView'
import { getProductGanttConfig } from './ganttView'
import { getProductKanbanConfig } from './kanbanView'
import { ServerActionConfig } from '../../../../components/Base/Actions'
import { getDefaultServerActions } from '../../../../components/Base/Actions'
import { Package, Layers, Barcode } from 'lucide-react'
import { createElement } from 'react'

// Centralized product config - Odoo-like architecture
export const productConfig = {
  entityName: 'Product',
  entityNamePlural: 'Products',
  apiEndpoint: '/api/products',
  
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
      key: 'print_barcode',
      label: 'Print Barcode',
      icon: createElement(Barcode, { size: 16 }),
      color: 'violet' as const,
      mode: 'both' as const,
      helper: 'Print product barcode labels (one per page)',
      template: 'ProductBarcodePrintTemplate'
    },
    {
      key: 'print_barcode_continuous',
      label: 'Print Bulk Barcodes',
      icon: createElement(Barcode, { size: 16 }),
      color: 'blue' as const,
      mode: 'bulk' as const,
      helper: 'Print multiple barcodes continuously (no page breaks)',
      template: 'ProductBarcodeContinuousTemplate',
    },
    {
      key: 'update_stock',
      label: 'Update Stock',
      icon: createElement(Package, { size: 16 }),
      color: 'blue' as const,
      mode: 'edit' as const,
      helper: 'Update stock levels for this product',
      onClick: async (data: any[], context?: any) => {
        const record = context?.record || data[0]
        console.log('Update Stock for:', record)
        // TODO: Implement stock update logic
        alert('Update Stock functionality - Coming soon!')
      }
    },
    {
      key: 'view_variants',
      label: 'View Variants',
      icon: createElement(Layers, { size: 16 }),
      color: 'violet' as const,
      mode: 'edit' as const,
      helper: 'View and manage product variants',
      onClick: async (data: any[], context?: any) => {
        const record = context?.record || data[0]
        console.log('View Variants for:', record)
        // TODO: Implement variants view logic
        alert('View Variants functionality - Coming soon!')
      }
    }
  ] as ServerActionConfig[],
  
  // View-specific configs (without actions)
  listViewConfig: (data: any[] = []) => getProductListConfig(data),
  formViewConfig: productFormConfig,
  ganttViewConfig: (data: any[] = []) => getProductGanttConfig(data),
  kanbanViewConfig: (data: any[] = []) => getProductKanbanConfig(data)
}

// Helper to get all configs for a model (legacy support)
export const getProductConfigs = (data: any[] = []) => ({
  formView: productFormConfig,
  listView: getProductListConfig(data),
  ganttView: getProductGanttConfig(data),
  kanbanView: getProductKanbanConfig(data),
})
