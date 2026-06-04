// Export all product attribute value view configurations
export { productAttributeValueFormConfig, type ProductAttributeValueFormConfig } from './formView'
export { getProductAttributeValueListConfig, type ProductAttributeValueListConfig } from './listView'

import { productAttributeValueFormConfig } from './formView'
import { getProductAttributeValueListConfig } from './listView'
import { ServerActionConfig } from '@/components/Base/Actions'

// Centralized product attribute value config - Odoo-like architecture
export const productAttributeValueConfig = {
  entityName: 'Product Attribute Value',
  entityNamePlural: 'Product Attribute Values',
  apiEndpoint: '/api/dashboard/product-attribute-values',
  
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
  customServerActions: [] as ServerActionConfig[],
  
  // View-specific configs (without actions)
  listViewConfig: (data: any[] = []) => getProductAttributeValueListConfig(data),
  formViewConfig: productAttributeValueFormConfig,
}

// Helper to get all configs for a model (legacy support)
export const getProductAttributeValueConfigs = (data: any[] = []) => ({
  formView: productAttributeValueFormConfig,
  listView: getProductAttributeValueListConfig(data),
})
