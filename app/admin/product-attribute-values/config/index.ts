// Export all product attribute value view configurations
export { productAttributeValueFormConfig, type ProductAttributeValueFormConfig } from './formView'
export { getProductAttributeValueListConfig, type ProductAttributeValueListConfig } from './listView'

import { productAttributeValueFormConfig } from './formView'
import { getProductAttributeValueListConfig } from './listView'
import { ServerActionConfig } from '@/components/admin/ResourceView/ServerActions'
import { getDefaultServerActions } from '@/components/admin/ResourceView/ServerActions'
import { Copy } from 'lucide-react'
import { createElement } from 'react'

// Centralized product attribute value config - Odoo-like architecture
export const productAttributeValueConfig = {
  entityName: 'Product Attribute Value',
  entityNamePlural: 'Product Attribute Values',
  apiEndpoint: '/api/admin/product-attribute-values',
  
  // Default action flags - built-in actions enabled by default
  defaultActions: {
    print: true,
    exportExcel: true,
    delete: true,
    duplicate: true,
    copyJson: true,
  },
  
  // Custom ServerActions - additional actions beyond defaults
  customServerActions: [
    {
      key: 'duplicate_value',
      label: 'Duplicate Value',
      icon: createElement(Copy, { size: 16 }),
      color: 'blue' as const,
      mode: 'edit' as const,
      helper: 'Duplicate this attribute value',
      onClick: async (data: any[], context?: any) => {
        const record = context?.record || data[0]
        console.log('Duplicate Value for:', record)
        // TODO: Implement duplicate value logic
        alert('Duplicate Value functionality - Coming soon!')
      }
    }
  ] as ServerActionConfig[],
  
  // View-specific configs (without actions)
  listViewConfig: (data: any[] = []) => getProductAttributeValueListConfig(data),
  formViewConfig: productAttributeValueFormConfig,
}

// Helper to get all configs for a model (legacy support)
export const getProductAttributeValueConfigs = (data: any[] = []) => ({
  formView: productAttributeValueFormConfig,
  listView: getProductAttributeValueListConfig(data),
})
