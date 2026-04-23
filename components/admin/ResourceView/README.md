# ResourceView Component

A unified parent component that manages ListView, KanbanView, FormView, and GanttView for seamless navigation between different view types.

## ServerActions Component

The ServerActions component is a shared action system inspired by Odoo's server actions. It allows you to define reusable actions that can be used across different views (ListView, FormView) for the same model, reducing code duplication and improving maintainability.

### Location
`components/admin/ResourceView/ServerActions/index.tsx`

### Features
- **Shared Actions**: Define actions once, use them across ListView (bulk actions) and FormView (quick actions)
- **Confirmation Dialogs**: Built-in confirmation support via Modal
- **Helper Tooltips**: Whisper tooltips with bottom placement for action descriptions
- **Mode Filtering**: Actions can be filtered by mode (create, edit, both, bulk)
- **Conditional Display**: Actions can be shown/hidden based on data/context
- **Loading States**: Built-in loading state management for async actions
- **Multiple Layouts**: Support for inline, toolbar, drawer, and dropdown layouts

### ServerActionConfig Interface

```typescript
export interface ServerActionConfig {
    label: string
    key: string
    icon?: React.ReactNode
    color?: 'blue' | 'green' | 'red' | 'orange' | 'violet' | 'yellow' | 'cyan'
    variant?: 'default' | 'primary' | 'danger' | 'success' | 'warning' | 'info'
    onClick: (data: any[], context?: ActionContext) => void | Promise<void>
    show?: (data: any[], context?: ActionContext) => boolean
    confirm?: string | ((data: any[], context?: ActionContext) => string)
    helper?: string
    mode?: 'create' | 'edit' | 'both' | 'bulk'
    readonly?: boolean
    badge?: string | number
    className?: string
}
```

### ActionContext Interface

```typescript
export interface ActionContext {
    mode: 'bulk' | 'single'
    view: 'list' | 'form'
    record?: any
    selectedIds?: string[]
}
```

### Usage Example

```typescript
import { ServerActions, ServerActionConfig, ActionContext } from '@/components/admin/ResourceView/ServerActions'

const actions: ServerActionConfig[] = [
    {
        key: 'delete_selected',
        label: 'Delete Selected',
        icon: <Trash2 size={16} />,
        color: 'red',
        mode: 'bulk',
        confirm: (data, context) => `Delete ${context.selectedIds?.length || data.length} selected records?`,
        helper: 'Permanently remove selected records',
        onClick: async (data, context) => {
            // Delete logic here
        }
    }
]

<ServerActions
    actions={actions}
    data={selectedData}
    context={{ mode: 'bulk', view: 'list', selectedIds: selectedIds }}
    layout="drawer"
    block
/>
```

---

## Features

- **Unified View Management**: Switch between List, Kanban, Gantt, and Form views
- **State Preservation**: Maintain state when switching between views
- **Edit/Create Workflow**: Automatically switch to FormView for editing or creating records
- **Config-Based**: All views are configured through a single config object
- **Reusable**: Designed for reuse across different models and projects

## Folder Structure

```
components/admin/ResourceView/
├── index.tsx          # Main ResourceView component
├── types.ts           # TypeScript type definitions
└── README.md          # This file
```

## Usage

### Basic Usage

```tsx
import { ResourceView } from '@/components/admin/ResourceView'
import { ListView } from '@/components/admin/ResourceView/ListView'
import { KanbanView } from '@/components/admin/ResourceView/KanbanView'
import { GanttView } from '@/components/admin/ResourceView/GanttView'
import { FormView } from '@/components/admin/ResourceView/FormView'

const config = {
  type: 'list',
  listViewConfig: {
    title: 'Products',
    columns: productColumns,
    data: productData,
    showFilters: true,
    showSearch: true,
    enableGroupBy: true,
    enableGanttView: true,
  },
  kanbanViewConfig: {
    mode: 'state-control',
    stateField: 'status',
    columns: statusColumns,
    data: productData,
    onStateChange: handleStatusUpdate,
  },
  formViewConfig: productFormConfig,
  ganttConfig: {
    startDateKey: 'startDate',
    endDateKey: 'endDate',
    titleKey: 'name',
  },
}

<ResourceView
  config={config}
  onEdit={handleEdit}
  onCreate={handleCreate}
  onDelete={handleDelete}
  loading={loading}
/>
```

## View Types

### List View
- Displays data in a table format
- Supports filtering, sorting, pagination, and grouping
- Gantt view can be enabled for timeline visualization

### Kanban View
- Displays data in columns based on state
- Supports drag-and-drop to move items between columns
- Automatically updates state field when items are moved

### Form View
- Used for creating and editing records
- Automatically switches from list/form when edit/create is triggered
- Returns to list view after form submission

### Gantt View
- Timeline visualization of data
- Currently embedded within ListView
- Configured through listViewConfig with gantt settings

## API Reference

### ResourceViewConfig

```typescript
interface ResourceViewConfig {
  type: ResourceType  // 'list' | 'kanban' | 'gantt' | 'form'
  listViewConfig?: ListViewConfig
  kanbanViewConfig?: KanbanViewConfig
  formViewConfig?: FormConfig
  ganttConfig?: {
    startDateKey: string
    endDateKey: string
    titleKey: string
  }
}
```

### ResourceViewProps

```typescript
interface ResourceViewProps {
  config: ResourceViewConfig
  onEdit?: (rowData: any) => void
  onCreate?: () => void
  onDelete?: (rowData: any) => void
  loading?: boolean
}
```

## Workflow

1. **List Mode**: Display data in table format with filters, search, and pagination
2. **Kanban Mode**: Display data in columns based on state with drag-and-drop
3. **Gantt Mode**: Display data as timeline (embedded in ListView)
4. **Form Mode**: Display form for creating or editing records
5. **Transitions**: 
   - Click "Edit" on a record → Switch to Form View in edit mode
   - Click "Create" button → Switch to Form View in create mode
   - Form completion → Return to previous view (List by default)

## Integration Example

```tsx
// In your page component
import { ResourceView } from '@/components/admin/ResourceView'
import { getProductListConfig, productFormConfig } from '@/app/admin/products/config'

export default function ProductsPage() {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])

  const handleEdit = (product) => {
    // Handle edit logic
  }

  const handleCreate = () => {
    // Handle create logic
  }

  const handleDelete = (product) => {
    // Handle delete logic
  }

  const config = {
    type: 'list',
    listViewConfig: getProductListConfig(products),
    formViewConfig: productFormConfig,
  }

  return (
    <ResourceView
      config={config}
      onEdit={handleEdit}
      onCreate={handleCreate}
      onDelete={handleDelete}
      loading={loading}
    />
  )
}
```

## Architecture

The ResourceView serves as the parent component that:
- Manages view state transitions
- Coordinates between different view components
- Provides a unified API for all view types
- Simplifies integration across the application

### Component Hierarchy
```
ResourceView
├── ListView
│   ├── Table
│   │   ├── Checkbox Column (selection)
│   │   ├── Column Picker Column (three-dot menu)
│   │   └── Data Columns
│   ├── Filter Panel
│   ├── Column Picker (legacy, kept for backward compatibility)
│   └── Actions Drawer
├── KanbanView
├── GridView
├── GanttView
└── FormView
```

### State Management
- **External State**: ResourceView manages global state (search, filter panel, selected IDs, actions drawer)
- **Local State**: ListView uses local state when external state is not provided
- **State Propagation**: State can be passed down from ResourceView to ListView via props

### ListView Component Features

#### Key Features:
- **Checkbox Selection**: RSuite Checkbox component for selecting rows
  - Wrapped in div with stopPropagation to prevent row navigation when clicking checkboxes
  - Header checkbox for select all functionality
- **Column Picker**: Located in table header with three-dot menu icon
  - Opens Whisper/Popover dropdown with column checkboxes
  - Allows showing/hiding columns dynamically
- **Summary/Summable**: Display summary statistics for numeric columns
  - Supports: sum, count, avg, min, max
  - Configured via `summary` and `summaryType` properties in column config
- **Pagination**: RSuite Pagination component with configurable page size
- **Sorting**: Click column headers to sort by that column
- **Filtering**: Filter panel with various input types based on column filterType
- **Bulk Actions**: When records are selected via checkboxes:
  - Actions Button appears in the ResourceView header toolbar (next to Search, Filter, Add New)
  - Clicking the Actions button opens a right-side Drawer with:
    - Export to Excel (with FileSpreadsheet icon)
    - Delete Selected (with Trash2 icon, red color)
    - **Custom Bulk Actions** (configured per model/entity)
  - The drawer shows the count of selected items in the title
  - Custom bulk actions can be configured via `bulkActions` property in ListViewConfig:
    ```typescript
    import { Package, AlertTriangle } from 'lucide-react'

    export const listViewConfig: ListViewConfig = {
      title: 'Products',
      columns: [...],
      bulkActions: [
        {
          label: 'Apply Stock',
          icon: <Package size={16} />,
          color: 'green',
          confirm: 'Apply stock to selected products?',
          helper: 'Update inventory levels for selected products',
          onClick: (selectedIds, selectedData) => {
            console.log('Apply stock to:', selectedIds)
            // Custom logic to apply stock to selected products
          }
        },
        {
          label: 'Mark as Low Stock',
          icon: <AlertTriangle size={16} />,
          color: 'orange',
          show: (selectedIds, selectedData) => {
            // Only show if at least one item has stock < 10
            return selectedData.some(item => item.stock < 10)
          },
          confirm: (selectedIds, selectedData) => {
            return `Mark ${selectedIds.length} products as low stock?`
          },
          onClick: (selectedIds, selectedData) => {
            console.log('Mark as low stock:', selectedIds)
            // Custom logic to mark items as low stock
          }
        }
      ]
    }
    ```
    **BulkActionConfig Properties:**
    - `label`: Button label text
    - `icon`: Optional React icon component
    - `color`: Button color (blue, green, red, orange, violet, yellow, cyan)
    - `onClick`: Function called when button is clicked, receives selectedIds and selectedData
    - `show`: Optional function to conditionally show/hide the action based on selection
    - `confirm`: Optional string or function for confirmation dialog before executing action
      - If string: Static confirmation message
      - If function: Dynamic confirmation message based on selectedIds and selectedData
      - If not provided: No confirmation dialog will be shown
    - `helper`: Optional helper text that appears on hover (Whisper tooltip with bottom placement)

### Configuration
ListView configuration is defined in `app/admin/[entity]/config/listView.ts`:
```typescript
export const listViewConfig: ListViewConfig = {
  columns: [
    {
      key: 'price',
      title: 'Price',
      width: 100,
      sortable: true,
      filterable: true,
      filterType: 'number',
      summary: true,
      summaryType: 'sum',
      render: (value: any) => `$${parseFloat(value).toFixed(2)}`
    }
  ],
  pageSize: 20
}
```
