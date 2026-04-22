# ResourceView Component

A unified parent component that manages ListView, KanbanView, FormView, and GanttView for seamless navigation between different view types.

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

See the main `components/admin/README.md` for the complete architecture overview.
