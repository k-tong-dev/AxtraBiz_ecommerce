# FormView Architecture

A comprehensive, reusable form system for Next.js applications inspired by Odoo's FormView pattern.

## 🚀 Overview

FormView provides a unified architecture for creating and managing forms across different entities (Products, Customers, Orders, etc.) with consistent UI, validation, and behavior.

## 📁 Structure

```text
components/admin/FormView/
├── FormView.tsx              # Main form component
├── index.ts                  # Global exports
├── README.md                 # This documentation
├── config/
│   └── registry.ts          # Configuration registry
├── form-configs/
│   ├── productConfig.ts      # Product form configuration
│   └── customerConfig.ts     # Customer form configuration
└── utils/
    ├── api-client.ts         # Unified API operations
    ├── validation.ts          # Form validation utilities
    └── file-upload.ts        # File upload handling
```

## 🎯 Key Features

### ✅ **Unified Form Component**
- Single component handles all entity types
- Mode-aware (create/edit) behavior
- Responsive grid layouts
- Built-in change tracking
- Smart action buttons

### ✅ **Configuration-Driven**
- Declarative form definitions
- Type-safe field configurations
- Entity-specific behavior
- Reusable across applications

### ✅ **Comprehensive Utilities**
- **API Client**: Unified CRUD operations
- **Validation Engine**: Built-in and custom rules
- **File Upload**: Complete upload management
- **Registry System**: Dynamic configuration loading

### ✅ **Enterprise Features**
- Batch operations support
- Progress tracking
- Error handling
- Type safety throughout
- Performance optimized

## 🚀 Quick Start

### 1. Basic Usage

```typescript
import { FormView, productFormConfig } from '@/components/admin/FormView'

export default function ProductPage() {
  return (
    <FormView 
      mode="create"
      config={productFormConfig}
    />
  )
}
```

### 2. Edit Mode

```typescript
import { FormView, productFormConfig } from '@/components/admin/FormView'

export default function EditProductPage() {
  const [product, setProduct] = useState(null)
  
  // Load product data...
  
  return (
    <FormView 
      mode="edit"
      config={productFormConfig}
      initialData={product}
      entityId={productId}
    />
  )
}
```

### 3. Custom Configuration

```typescript
import { createFormConfig } from '@/components/admin/FormView'

const customConfig = createFormConfig()
  .entityName('Custom Entity')
  .entityNamePlural('Custom Entities')
  .apiEndpoint('/api/custom')
  .fields([
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      validation: (value) => {
        if (!value || value.length < 2) {
          return 'Name must be at least 2 characters'
        }
        return null
      }
    }
  ])
  .actions({
    print: true,
    export: true,
    delete: true
  })
  .breadcrumbs({
    base: '/admin',
    list: '/admin/custom',
    create: '/admin/custom/new',
    edit: '/admin/custom'
  })
  .build()
```

## 📝 Field Types

FormView supports multiple field types:

### FormField Interface

```typescript
export interface FormField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'select' | 'file' | 'array' | 'json'
  required?: boolean
  placeholder?: string
  options?: Array<{ label: string; value: string }>
  validation?: (value: any) => string | null
  className?: string
  gridCols?: number        // Grid grouping for layout (replaces gridCols)
  rows?: number
  accept?: string
  width?: string
  icon?: React.ReactNode
  uploadText?: string
  order?: number           // Field ordering priority
  after?: string           // Position after specific field
  before?: string           // Position before specific field
  gridRow?: number          // Specific grid row position
  gridColumn?: number        // Specific grid column position
  tab?: string             // Tab identifier for organizing fields in tabs
}
```

### TabConfig Interface

```typescript
export interface TabConfig {
  key: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}
```

### FormConfig Interface (Updated)

```typescript
export interface FormConfig {
  entityName: string
  entityNamePlural: string
  apiEndpoint: string
  fields: FormField[]
  tabs?: TabConfig[]        // NEW: Optional tabs configuration
  defaultTab?: string       // NEW: Default active tab
  actions: { /* ... */ }
  breadcrumbs: { /* ... */ }
}
```

### Text Input
```typescript
{
  key: 'name',
  label: 'Name',
  type: 'text',
  required: true,
  placeholder: 'Enter name',
  validation: (value) => value ? null : 'Name is required',
  gridCols: 2
}
```

### Number Input
```typescript
{
  key: 'price',
  label: 'Price',
  type: 'number',
  required: true,
  placeholder: '0.00',
  validation: (value) => value >= 0 ? null : 'Price must be positive'
}
```

### Select Dropdown
```typescript
{
  key: 'category',
  label: 'Category',
  type: 'select',
  required: true,
  options: [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' }
  ]
}
```

### Textarea
```typescript
{
  key: 'description',
  label: 'Description',
  type: 'textarea',
  required: false,
  placeholder: 'Enter description',
  rows: 4
}
```

### File Upload
```typescript
{
  key: 'images',
  label: 'Product Images',
  type: 'file',
  accept: 'image/*',           // File type restrictions
  width: '100%',               // Custom width
  icon: '🖼️',               // Custom icon
  uploadText: 'Upload product images',  // Custom upload text
  gridCols: 1
}
```

### Enhanced File Upload Options:
- **accept**: Restrict file types (e.g., `'image/*'`, `'application/pdf'`)
- **width**: Custom width for upload area (e.g., `'100%'`, `'300px'`)
- **icon**: Custom icon to display (React.ReactNode)
- **uploadText**: Custom upload button text
- **className**: Additional CSS classes for styling

### Array Fields
```typescript
{
  key: 'features',
  label: 'Features',
  type: 'array',
  required: false,
  placeholder: 'Enter feature'
}
```

## 🔧 Advanced Usage

### API Client

```typescript
import { formViewAPI } from '@/components/admin/FormView'

// Get all items
const products = await formViewAPI.get('/api/products', {
  page: 1,
  limit: 20,
  search: 'laptop'
})

// Get single item
const product = await formViewAPI.getById('/api/products', 'product-id')

// Create item
const result = await formViewAPI.create('/api/products', {
  name: 'New Product',
  price: 99.99
})

// Update item
const result = await formViewAPI.update('/api/products', 'product-id', {
  name: 'Updated Product'
})

// Delete item
const result = await formViewAPI.delete('/api/products', 'product-id')

// Batch operations
const result = await formViewAPI.batchDelete('/api/products', ['id1', 'id2'])
```

### Validation

```typescript
import { FormViewValidator, commonValidations } from '@/components/admin/FormView'

// Use built-in validations
const fieldConfig = {
  key: 'email',
  label: 'Email',
  type: 'text',
  validation: commonValidations.email
}

// Custom validation
const fieldConfig = {
  key: 'custom',
  label: 'Custom Field',
  type: 'text',
  validation: FormViewValidator.combine(
    FormViewValidator.required(),
    FormViewValidator.minLength(5),
    FormViewValidator.custom((value) => {
      if (value && !value.includes('special')) {
        return 'Must contain "special"'
      }
      return null
    })
  )
}

// Form validation
const errors = FormViewValidator.validateForm(formData, {
  name: commonValidations.name,
  email: commonValidations.email,
  price: commonValidations.price
})
```

### File Upload

```typescript
import { FormViewFileUploader, defaultUploadOptions } from '@/components/admin/FormView'

// Upload files
const files = await FormViewFileUploader.uploadFiles(selectedFiles, {
  ...defaultUploadOptions.image,
  maxSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 5
}, (fileIndex, progress) => {
  console.log(`File ${fileIndex}: ${progress}%`)
})

// Compress images
const compressedFile = await FormViewFileUploader.compressImage(file, 1920, 1080, 0.8)
```

### Configuration Registry

```typescript
import { 
  formViewRegistry, 
  registerFormConfig, 
  getFormConfig 
} from '@/components/admin/FormView'

// Register new configuration
registerFormConfig('order', orderFormConfig)

// Get configuration
const config = getFormConfig('product')

// Get all configurations
const allConfigs = formViewRegistry.getAll()

// Load configuration dynamically
const config = await formViewRegistry.loadFormConfig('new-entity')
```

## 🎨 UI Components

### Form Layout Architecture

FormView uses a **3-column grid layout** with intelligent field placement:

```typescript
// Layout Structure
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Main Form Area (2 columns) */}
  <div className="lg:col-span-2">
    {/* All fields EXCEPT file uploads */}
  </div>
  
  {/* Right Sidebar (1 column) */}
  <div className="space-y-6">
    {/* File Upload Section */}
    {/* Quick Actions */}
  </div>
</div>
```

### Field Placement Rules

**Main Form Area (Left Side - 2 columns):**
- All field types: `text`, `textarea`, `number`, `select`, `array`, `json`
- **EXCLUDES**: `file` type fields
- Responsive grid layouts based on `gridCols` property

**Right Sidebar (Right Side - 1 column):**
- **ONLY**: `file` type fields
- Quick Actions section
- Always visible for easy access

### Responsive Grid Layout
```typescript
// Fields automatically arrange in responsive grids
{
  key: 'name',
  gridCols: 2  // 2 columns on desktop, 1 on mobile
}

{
  key: 'description', 
  gridCols: 1  // Full width
}
```

## Tabs Support

FormView now supports **RSuite Tabs** for organizing fields into logical sections:

### Basic Tabs Configuration

```typescript
export const productFormConfig: FormConfig = {
  entityName: 'Product',
  entityNamePlural: 'Products',
  apiEndpoint: '/api/products',
  tabs: [
    {
      key: 'basic',
      label: 'Basic Info',
      icon: <Info className="w-4 h-4" />
    },
    {
      key: 'pricing',
      label: 'Pricing',
      icon: <DollarSign className="w-4 h-4" />
    },
    {
      key: 'inventory',
      label: 'Inventory',
      icon: <Package className="w-4 h-4" />
    }
  ],
  defaultTab: 'basic',
  fields: [
    // Fields assigned to tabs
    {
      key: 'name',
      label: 'Product Name',
      type: 'text',
      tab: 'basic',        // Assign to "Basic Info" tab
      gridCols: 2
    },
    {
      key: 'price',
      label: 'Sale Price',
      type: 'number',
      tab: 'pricing',      // Assign to "Pricing" tab
      gridCols: 2
    },
    {
      key: 'stock',
      label: 'Stock Quantity',
      type: 'number',
      tab: 'inventory',   // Assign to "Inventory" tab
      gridCols: 2
    }
  ]
}
```

### Tabs Features

- **RSuite Integration**: Uses official RSuite Tabs component
- **Icon Support**: Add icons to tab headers
- **Disabled Tabs**: Mark tabs as disabled
- **Default Tab**: Set the initially active tab
- **Flexible Layout**: Each tab supports gridCols layout
- **Automatic Fallback**: Fields without `tab` go to defaultTab

### Tab Field Assignment

```typescript
// Field assignment rules
{
  key: 'field1',
  tab: 'basic',        // Explicit tab assignment
  // Goes to "basic" tab
}

{
  key: 'field2',
  // No tab specified
  // Goes to defaultTab (first tab if not set)
}

{
  key: 'field3',
  type: 'file',
  // File fields ALWAYS go to sidebar, regardless of tab
}
```

// File fields automatically go to sidebar
{
  key: 'images',
  type: 'file',
  // Automatically rendered in right sidebar
}
```

### Smart Action Buttons
- **Create Mode**: Only shows Cancel/Create buttons
- **Edit Mode**: Shows full action dropdown (Print, Export, Duplicate, Archive, Delete)

### Change Tracking
- Automatically detects form changes
- Shows/hides action bar based on modifications
- Prevents accidental navigation

### Breadcrumb Navigation
- Automatic breadcrumb generation
- Entity-aware navigation paths
- Consistent across all forms

## 🛠️ Configuration Options

### Form Actions
```typescript
actions: {
  print: boolean,      // Show print action
  export: boolean,      // Show export action
  duplicate: boolean,    // Show duplicate action
  copy: boolean,        // Show copy action
  archive: boolean,     // Show archive action
  delete: boolean       // Show delete action
}
```

### Breadcrumbs
```typescript
breadcrumbs: {
  base: string,      // Dashboard URL
  list: string,      // List page URL
  create: string,     // Create page URL
  edit: string        // Edit page URL
}
```

## 🔍 Best Practices

### 1. Configuration Design
- Use descriptive field labels
- Implement proper validation
- Set appropriate grid layouts
- Define clear action permissions

### 2. Performance
- Use lazy loading for large forms
- Implement proper error boundaries
- Optimize file upload sizes

### 3. User Experience
- Provide clear error messages
- Show loading states
- Implement proper confirmation dialogs
- Support keyboard navigation

### 4. Type Safety
- Always type your configurations
- Use  strict mode
- Implement proper error handling
- Validate data at boundaries

## 🚀 Migration Guide

### From Custom Forms
1. **Identify Fields**: Map existing form fields to FormView types
2. **Create Config**: Build configuration object
3. **Replace Component**: Swap custom form with FormView
4. **Test**: Verify all functionality works
5. **Remove Old Code**: Delete custom form components

### Example Migration
```typescript
// Before (Custom Form)
function ProductForm({ product, onSave }) {
  const [name, setName] = useState(product?.name || '')
  const [price, setPrice] = useState(product?.price || '')
  
  const handleSubmit = () => {
    // Custom validation and submission logic
    onSave({ name, price })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={price} onChange={(e) => setPrice(e.target.value)} />
      <button type="submit">Save</button>
    </form>
  )
}

// After (FormView)
function ProductPage() {
  return (
    <FormView 
      mode="edit"
      config={productFormConfig}
      initialData={product}
      entityId={product.id}
    />
  )
}
```

## 🔧 Troubleshooting

### Common Issues

#### Import Errors
```bash
# Error: Export doesn't exist
# Solution: Use direct imports
import { productFormConfig } from '@/components/admin/form-configs/productConfig'
```

#### Type Errors
```bash
# Error: Type 'string' is not assignable to type 'number'
# Solution: Check field type definitions
type: 'number',  // Not 'string'
```

#### Validation Issues
```bash
# Error: Validation not working
# Solution: Check validation function return types
validation: (value) => value ? null : 'Error message'  // Returns string | null
```

## 🎯 Future Enhancements

### Planned Features
- [ ] **Dynamic Field Types**: Add more field types (date, time, color)
- [ ] **Advanced Validation**: Regex builder, conditional validation
- [ ] **Form Themes**: Multiple visual themes
- [ ] **Field Groups**: Collapsible field sections
- [ ] **Auto-save**: Draft saving functionality
- [ ] **Form Wizards**: Multi-step forms
- [ ] **Real-time Validation**: Live validation feedback

### Contributing
1. **Fork Repository**: Create your own version
2. **Create Feature Branch**: `git checkout -b feature-name`
3. **Make Changes**: Implement your feature
4. **Add Tests**: Write comprehensive tests
5. **Submit PR**: Create pull request with description

## 📞 Support

For issues, questions, or contributions:
- **Documentation**: Check this README first
- **Examples**: Review the example configurations
- **Issues**: Check existing GitHub issues
- **Discussions**: Join community discussions

## 📄 License

This FormView architecture is part of the eCommerce application and follows the same licensing terms.

---

**Built with ❤️ for scalable form management across Next.js applications**
