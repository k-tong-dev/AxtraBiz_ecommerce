// Export all product attribute view configurations
export { productAttributeFormConfig, type ProductAttributeFormConfig } from './formView'
export { getProductAttributeListConfig, type ProductAttributeListConfig } from './listView'

import { productAttributeFormConfig } from './formView'
import { getProductAttributeListConfig } from './listView'
import { ServerActionConfig } from '@/components/Base/Actions'
import { Copy } from 'lucide-react'
import { createElement } from 'react'

// Centralized product attribute config - Odoo-like architecture
export const productAttributeConfig = {
  entityName: 'Product Attribute',
  entityNamePlural: 'Product Attributes',
  apiEndpoint: '/api/dashboard/product-attributes',
  
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
      key: 'duplicate_attribute',
      label: 'Duplicate Attribute',
      icon: createElement(Copy, { size: 16 }),
      color: 'blue' as const,
      mode: 'edit' as const,
      helper: 'Duplicate this attribute with all its values',
      onClick: async (data: any[], context?: any) => {
        const record = context?.record || data[0]
        console.log('Duplicate Attribute for:', record)
        // TODO: Implement duplicate attribute logic
        alert('Duplicate Attribute functionality - Coming soon!')
      }
    }
  ] as ServerActionConfig[],
  
  // View-specific configs (without actions)
  listViewConfig: (data: any[] = []) => getProductAttributeListConfig(data),
  formViewConfig: productAttributeFormConfig,
}

// Helper to get all configs for a model (legacy support)
export const getProductAttributeConfigs = (data: any[] = []) => ({
  formView: productAttributeFormConfig,
  listView: getProductAttributeListConfig(data),
})
