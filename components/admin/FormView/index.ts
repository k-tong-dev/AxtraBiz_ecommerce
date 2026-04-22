// Global FormView exports for easy usage across the application
export { FormView } from './FormView'
export type { FormConfig, FormField, Entity, MutableEntity } from './FormView'

// Export all form configurations
export { productFormConfig } from '../form-configs/productConfig'
export { customerFormConfig } from '../form-configs/customerConfig'
export type { ProductFormConfig } from '../form-configs/productConfig'
export type { CustomerFormConfig } from '../form-configs/customerConfig'

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
  getProductConfig,
  getCustomerConfig,
  loadFormConfig,
  createFormConfig
} from './config/registry'
export type { EntityType, FormConfigRegistry } from './config/registry'
