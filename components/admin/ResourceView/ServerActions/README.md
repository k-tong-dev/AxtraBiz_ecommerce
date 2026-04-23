# ServerActions Component

A shared action system inspired by Odoo's server actions. Allows defining reusable actions that work across ListView (bulk actions) and FormView (quick actions).

## Location
- Component: `components/admin/ResourceView/ServerActions/index.tsx`
- Default Actions: `getDefaultServerActions()` function in the same file
- Documentation: This file

## Architecture

### Centralized Default Actions

The `getDefaultServerActions()` function provides built-in default actions that can be used by any resource. This is a generic utility that can be imported and used across different models (products, customers, orders, etc.).

```typescript
import { getDefaultServerActions } from '@/components/admin/ResourceView/ServerActions'

const defaultActions = getDefaultServerActions({
  print: true,
  exportExcel: true,
  delete: true,
  duplicate: true,
  copyJson: true,
  archive: true,
  unarchive: true
})
```

**Available Default Actions:**
- `print`: Print the current record (mode: 'both')
- `exportExcel`: Export selected records to Excel (mode: 'bulk')
- `delete`: Delete record(s) (mode: 'both')
- `duplicate`: Create a copy of the record (mode: 'both')
- `copyJson`: Copy record data as JSON to clipboard (mode: 'both')
- `archive`: Archive the record (mode: 'both')
- `unarchive`: Unarchive the record (mode: 'both')

**Note:** All default actions except `exportExcel` use `mode: 'both'` to appear in both FormView and ListView bulk actions.

### Context-Aware Actions

ServerActions is designed to handle the same action in different contexts:

- **ListView (Bulk Mode)**: Actions operate on multiple selected records
  - `context.mode = 'bulk'`
  - `context.view = 'list'`
  - `context.selectedIds = ['id1', 'id2', ...]`
  - `data = [record1, record2, ...]`

- **FormView (Single Mode)**: Actions operate on a single record
  - `context.mode = 'single'`
  - `context.view = 'form'`
  - `context.record = { id: 'id1', ... }`
  - `data = [{ id: 'id1', ... }]`

### Example: Delete Action in Both Contexts

```typescript
const deleteAction: ServerActionConfig = {
    key: 'delete',
    label: 'Delete',
    icon: <Trash2 size={16} />,
    color: 'red',
    mode: 'both', // Works in both create and edit modes
    confirm: (data, context) => {
        if (context.mode === 'bulk') {
            return `Delete ${context.selectedIds?.length || data.length} selected records?`
        } else {
            return `Delete this record? This action cannot be undone.`
        }
    },
    helper: 'Permanently remove record(s)',
    onClick: async (data, context) => {
        if (context.mode === 'bulk') {
            // ListView: Delete multiple records
            const ids = context.selectedIds || data.map(d => d.id)
            await fetch('/api/bulk-delete', {
                method: 'POST',
                body: JSON.stringify({ ids })
            })
        } else {
            // FormView: Delete single record
            const id = context.record?.id || data[0]?.id
            await fetch(`/api/records/${id}`, {
                method: 'DELETE'
            })
        }
    }
}
```

## ServerActionConfig Interface

```typescript
export interface ServerActionConfig {
    label: string              // Button label
    key: string                // Unique action identifier
    icon?: React.ReactNode     // Icon component
    color?: 'blue' | 'green' | 'red' | 'orange' | 'violet' | 'yellow' | 'cyan'
    variant?: 'default' | 'primary' | 'danger' | 'success' | 'warning' | 'info'
    onClick: (data: any[], context?: ActionContext) => void | Promise<void>
    show?: (data: any[], context?: ActionContext) => boolean
    confirm?: string | ((data: any[], context?: ActionContext) => string)
    helper?: string            // Tooltip text shown on hover
    mode?: 'create' | 'edit' | 'both' | 'bulk'
    readonly?: boolean
    badge?: string | number
    className?: string
}
```

## ActionContext Interface

```typescript
export interface ActionContext {
    mode: 'bulk' | 'single'      // 'bulk' for ListView, 'single' for FormView
    view: 'list' | 'form'       // Current view type
    record?: any                // Single record (FormView only)
    selectedIds?: string[]      // Selected IDs (ListView only)
}
```

## Usage Examples

### ListView (Bulk Actions)

```typescript
import { ServerActions, ServerActionConfig, ActionContext } from '@/components/admin/ResourceView/ServerActions'

const bulkActions: ServerActionConfig[] = [
    {
        key: 'delete_selected',
        label: 'Delete Selected',
        icon: <Trash2 size={16} />,
        color: 'red',
        mode: 'bulk',
        confirm: (data, context) => `Delete ${context.selectedIds?.length || data.length} records?`,
        helper: 'Permanently remove selected records',
        onClick: async (data, context) => {
            const ids = context.selectedIds || data.map(d => d.id)
            // Delete logic
        }
    },
    {
        key: 'export',
        label: 'Export to Excel',
        icon: <FileSpreadsheet size={16} />,
        color: 'green',
        mode: 'bulk',
        helper: 'Export selected records to Excel',
        onClick: async (data, context) => {
            // Export logic
        }
    }
]

// In ListView component
<ServerActions
    actions={bulkActions}
    data={selectedData}
    context={{
        mode: 'bulk',
        view: 'list',
        selectedIds: selectedIds
    }}
    onActionComplete={(actionKey) => {
        setActionsDrawerOpen(false)
    }}
    layout="drawer"
    block
/>
```

### FormView (Built-in Actions)

```typescript
const builtInActions: ServerActionConfig[] = [
    {
        key: 'delete',
        label: 'Delete',
        icon: <Trash2 size={16} />,
        color: 'red',
        mode: 'edit', // Only show in edit mode
        confirm: 'Delete this record? This action cannot be undone.',
        helper: 'Permanently remove this record',
        onClick: async (data, context) => {
            const id = context.record?.id || data[0]?.id
            await fetch(`/api/records/${id}`, { method: 'DELETE' })
            router.push('/list')
        }
    },
    {
        key: 'duplicate',
        label: 'Duplicate',
        icon: <Copy size={16} />,
        color: 'blue',
        mode: 'edit',
        helper: 'Create a copy of this record',
        onClick: async (data, context) => {
            const record = context.record || data[0]
            const duplicate = { ...record, id: undefined, name: `${record.name} (Copy)` }
            router.push(`/create?data=${JSON.stringify(duplicate)}`)
        }
    },
    {
        key: 'print',
        label: 'Print',
        icon: <Printer size={16} />,
        color: 'blue',
        mode: 'both',
        helper: 'Print this record',
        onClick: async (data, context) => {
            window.print()
        }
    }
]

// In FormView component
<ServerActions
    actions={builtInActions}
    data={[formData]}
    context={{
        mode: 'single',
        view: 'form',
        record: formData
    }}
    layout="toolbar"
/>
```

### FormView (Custom Quick Actions)

```typescript
const customActions: ServerActionConfig[] = [
    {
        key: 'send_email',
        label: 'Send Email',
        icon: <Mail size={16} />,
        color: 'blue',
        mode: 'edit',
        confirm: 'Send email notification to customer?',
        helper: 'Send email notification to the customer',
        onClick: async (data, context) => {
            const record = context.record || data[0]
            await fetch('/api/send-email', {
                method: 'POST',
                body: JSON.stringify({ email: record.email })
            })
        }
    },
    {
        key: 'archive',
        label: 'Archive',
        icon: <Archive size={16} />,
        color: 'orange',
        mode: 'edit',
        show: (data, context) => {
            // Only show if record is not already archived
            return !(context.record?.archived || data[0]?.archived)
        },
        helper: 'Move this record to archive',
        onClick: async (data, context) => {
            const id = context.record?.id || data[0]?.id
            await fetch(`/api/records/${id}/archive`, { method: 'POST' })
        }
    }
]
```

## Layout Options

The `layout` prop controls how actions are rendered:

- **`inline`**: Vertical stack of buttons (default for drawer)
- **`toolbar`**: Horizontal row of buttons (for action bars)
- **`drawer`**: Vertical stack with larger spacing (for side drawers)
- **`dropdown`**: Actions in a dropdown menu (future)

## Migration from BulkActionConfig

For existing ListView configurations using `BulkActionConfig`, use the converter:

```typescript
function convertToServerAction(config: BulkActionConfig): ServerActionConfig {
    return {
        key: config.label.toLowerCase().replace(/\s+/g, '_'),
        label: config.label,
        icon: config.icon,
        color: config.color,
        onClick: (data, context) => {
            const selectedIds = context?.selectedIds || []
            config.onClick(selectedIds, data)
        },
        show: (data, context) => {
            const selectedIds = context?.selectedIds || []
            return config.show ? config.show(selectedIds, data) : true
        },
        confirm: config.confirm ? (data, context) => {
            const selectedIds = context?.selectedIds || []
            if (typeof config.confirm === 'function') {
                return config.confirm(selectedIds, data)
            }
            return config.confirm as string
        } : undefined,
        helper: config.helper,
        mode: 'bulk'
    }
}
```

## Best Practices

1. **Always check context.mode**: Actions should handle both bulk and single modes
2. **Use context.record for FormView**: Access single record data via `context.record`
3. **Use context.selectedIds for ListView**: Access selected IDs via `context.selectedIds`
4. **Dynamic confirm messages**: Use function form of `confirm` to provide context-specific messages
5. **Mode filtering**: Use `mode` prop to control when actions appear (create, edit, both, bulk)
6. **Conditional display**: Use `show` prop to conditionally hide actions based on data/context
