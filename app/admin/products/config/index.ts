// Export all product view configurations
export { productFormConfig, type ProductFormConfig } from './formView'
export { getProductListConfig } from './listView'
export { getProductGanttConfig } from './ganttView'
export { getProductKanbanConfig } from './kanbanView'

import { productFormConfig } from './formView'
import { getProductListConfig } from './listView'
import { getProductGanttConfig } from './ganttView'
import { getProductKanbanConfig } from './kanbanView'

// Helper to get all configs for a model
export const getProductConfigs = (data: any[] = []) => ({
  formView: productFormConfig,
  listView: getProductListConfig(data),
  ganttView: getProductGanttConfig(data),
  kanbanView: getProductKanbanConfig(data),
})
