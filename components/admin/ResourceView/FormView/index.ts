// Global FormView exports for easy usage across the application
export { FormView } from './FormView'
export type { FormConfig, FormField, Entity, MutableEntity } from './FormView'

// Note: Form configurations are now model-specific
// - productFormConfig: app/admin/products/config/formView.ts
// - customerFormConfig: Should be moved to app/admin/customers/config/formView.ts
// FormView component is generic and doesn't include specific model configs

// Export utilities
export { FormViewAPI, formViewAPI, createFormViewAPI } from './utils/api-client'
export type { APIResponse, PaginationParams } from './utils/api-client'
export { FormViewValidator, commonValidations } from './utils/validation'
export type { ValidationRule, ValidationRules } from './utils/validation'
export { FormViewFileUploader, defaultUploadOptions } from './utils/file-upload'
export type { UploadedFile, FileUploadOptions } from './utils/file-upload'

// Export configuration registry
export { 
  formConfigRegistry, 
  FormViewRegistry, 
  registerFormConfig, 
  getFormConfig, 
  getAllFormConfigs, 
  hasFormConfig,
  loadFormConfig,
  createFormConfig
} from './config/registry'
export type { EntityType, FormConfigRegistry } from './config/registry'
