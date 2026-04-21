# ListView Component Documentation

## Overview

The `ListView` is a reusable, feature-rich table component built with shadcn/ui components. It provides a modern, responsive interface for displaying and managing tabular data with advanced features like filtering, sorting, pagination, and multiple view types.

## Features

- **Multiple View Types**: Switch between List, Kanban, and Grid views
- **Checkbox Selection**: Select individual rows or all rows for bulk operations
- **Export Functionality**: Export selected records to CSV
- **Global Search**: Search across all fields in the dataset
- **Column Sorting**: Sort data by clicking on column headers
- **Column Visibility Toggle**: Show/hide columns dynamically
- **Odoo-style Pagination**: Navigate through large datasets efficiently
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Custom Render Functions**: Format cell data with custom renderers
- **Configurable**: Highly customizable through configuration objects

## Installation

The ListView component is located at `components/admin/ListView.tsx`. It uses the following dependencies:

```typescript
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Filter, X, Download, Grid3x3, List, ChevronLeft, ChevronRight } from 'lucide-react'
```

## Usage

### Basic Example

```typescript
import { ListView } from '@/components/admin/ListView'
import { getProductListConfig } from '@/components/admin/list-configs/productListConfig'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  
  // Fetch products data...
  
  const config = getProductListConfig(products)
  
  return (
    <ListView 
      config={config}
      onRowClick={(row) => console.log('Row clicked:', row)}
      onEdit={(row) => router.push(`/admin/products/${row.id}/edit`)}
      onDelete={(row) => handleDelete(row.id)}
      loading={loading}
    />
  )
}
```

## Props Interface

```typescript
export interface ListViewProps {
  config: ListViewConfig          // Configuration object
  onRowClick?: (rowData: any) => void      // Callback when a row is clicked
  onEdit?: (rowData: any) => void          // Callback for edit action
  onDelete?: (rowData: any) => void        // Callback for delete action
  loading?: boolean                           // Loading state
}
```

## Configuration Interface

```typescript
export interface ListViewConfig {
  title: string                      // Title used for export filename
  columns: ListColumn[]              // Array of column definitions
  data: any[]                       // Array of data to display
  showColumnToggle?: boolean        // Show column visibility toggle (default: true)
  showSearch?: boolean              // Show global search (default: true)
  showFilters?: boolean             // Show column filters (default: true)
  showViewSwitcher?: boolean        // Show view type switcher (default: true)
  showExport?: boolean              // Show export button (default: true)
  defaultVisibleColumns?: string[]  // Array of column keys to show by default
  pageSize?: number                 // Number of rows per page (default: 20)
}
```

## Column Definition

```typescript
export interface ListColumn {
  key: string                       // Field key in data object
  title: string                     // Column header text
  width?: number                    // Column width (in pixels)
  resizable?: boolean              // Allow column resizing
  sortable?: boolean               // Enable sorting for this column
  filterable?: boolean             // Enable filtering for this column
  filterType?: FilterType          // Type of filter (text, number, date, options, boolean)
  filterOptions?: Array<{ label: string; value: any }>  // Options for filterType: 'options'
  render?: (value: any, rowData: any) => React.ReactNode  // Custom cell renderer
  align?: 'left' | 'center' | 'right'  // Text alignment
}
```

## Creating a List Configuration

### Example Configuration

```typescript
import React from 'react'
import { ListViewConfig, ListColumn } from '../ListView'

export const getProductListConfig = (data: any[] = []): ListViewConfig => ({
  title: 'Products',
  data: data,
  showColumnToggle: true,
  showSearch: true,
  showFilters: true,
  showViewSwitcher: true,
  showExport: true,
  defaultVisibleColumns: [
    'name',
    'sku',
    'price',
    'stock',
    'status'
  ],
  pageSize: 20,
  columns: [
    {
      key: 'id',
      title: 'ID',
      width: 80,
      sortable: true,
      filterable: false,
      align: 'center'
    },
    {
      key: 'name',
      title: 'Product Name',
      width: 200,
      resizable: true,
      sortable: true,
      filterable: true,
      filterType: 'text',
      align: 'left'
    },
    {
      key: 'price',
      title: 'Price',
      width: 100,
      sortable: true,
      filterable: true,
      filterType: 'number',
      align: 'right',
      render: (value) => `$${parseFloat(value).toFixed(2)}`
    },
    {
      key: 'stock',
      title: 'Stock',
      width: 80,
      sortable: true,
      filterable: true,
      filterType: 'number',
      align: 'center',
      render: (value) => {
        const stock = parseInt(value)
        if (stock <= 0) return <span className="text-red-500 font-semibold">{stock}</span>
        if (stock < 10) return <span className="text-yellow-500 font-semibold">{stock}</span>
        return <span className="text-green-500">{stock}</span>
      }
    },
    {
      key: 'status',
      title: 'Status',
      width: 100,
      sortable: true,
      filterable: true,
      filterType: 'options',
      filterOptions: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' }
      ],
      align: 'center',
      render: (value) => {
        const statusColors: Record<string, string> = {
          draft: 'gray',
          published: 'green',
          archived: 'red'
        }
        const color = statusColors[value] || 'gray'
        return <span className={`bg-${color}-100 text-${color}-800 px-2 py-1 rounded text-xs font-medium capitalize`}>{value}</span>
      }
    }
  ]
})
```

## View Types

### List View
The default table view with sortable columns and row selection.

### Kanban View
Card-based layout displaying up to 3 fields per card. Useful for visual browsing.

### Grid View
Compact card layout displaying up to 2 fields per card. Best for high-density displays.

## Features in Detail

### Checkbox Selection
- **Master Checkbox**: Located in the table header, selects/deselects all rows on the current page
- **Row Checkboxes**: Located in each row, selects/deselects individual rows
- **Bulk Actions**: When rows are selected, the "Delete (N)" button appears for bulk deletion
- **Export**: Export button shows count of selected rows

### Export Functionality
- Exports selected rows to CSV format
- Includes only visible columns
- Downloads file as `{title}_export.csv`
- Requires at least one row to be selected

### Pagination
- Configurable page size (default: 20)
- Shows "Showing X to Y of Z records"
- Smart page number display (max 5 page numbers visible)
- Previous/Next navigation buttons
- Automatically handles edge cases (first/last page)

### Column Visibility
- Click "Columns" button to toggle column visibility
- Checkboxes for each column
- Changes persist until page refresh
- Affects all view types

### Search
- Global search across all fields
- Case-insensitive
- Real-time filtering
- Works with all data types

### Sorting
- Click column header to sort
- Toggle between ascending/descending
- Visual indicator (↑/↓) shows current sort direction
- Only columns with `sortable: true` can be sorted

## Styling

The ListView uses Tailwind CSS classes for styling. You can customize the appearance by:

1. **Modifying the component**: Edit `components/admin/ListView.tsx`
2. **Using custom render functions**: Format cells with custom JSX
3. **Overriding CSS**: Add custom styles in your global CSS

## Responsive Behavior

- **Mobile (< 640px)**: Single column layout, stacked controls
- **Tablet (640px - 1024px)**: Multi-column grid for Kanban/Grid views
- **Desktop (> 1024px)**: Full layout with all features

## Best Practices

1. **Keep data manageable**: For large datasets (> 1000 rows), consider server-side pagination
2. **Use appropriate filter types**: Match filterType to your data type for better UX
3. **Custom render functions**: Use render functions for complex formatting (dates, currencies, statuses)
4. **Set reasonable defaults**: Configure `defaultVisibleColumns` to show the most important fields
5. **Handle loading state**: Always pass the `loading` prop when fetching data
6. **Provide callbacks**: Implement `onRowClick`, `onEdit`, and `onDelete` for full functionality

## Example: Full Implementation

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ListView } from '@/components/admin/ListView'
import { getProductListConfig } from '@/components/admin/list-configs/productListConfig'
import { showToast } from '@/lib/ui/toast'

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      showToast('error', 'Error', 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = (row: Product) => {
    router.push(`/admin/products/${row.id}/edit`)
  }

  const handleDelete = async (row: Product) => {
    const ok = window.confirm('Delete this product?')
    if (!ok) return

    try {
      await fetch(`/api/products/${row.id}`, { method: 'DELETE' })
      setProducts(prev => prev.filter(p => p.id !== row.id))
      showToast('success', 'Deleted', 'Product deleted successfully')
    } catch (error) {
      showToast('error', 'Error', 'Failed to delete product')
    }
  }

  const config = getProductListConfig(products)

  return (
    <Card className="mx-auto max-w-7xl border-border/50">
      <div className="flex items-center justify-between gap-4 px-6 pt-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your product catalog.</p>
        </div>
        <Button onClick={() => router.push('/admin/products/new')} size="sm">
          Add Product
        </Button>
      </div>

      <div className="p-6 pt-0">
        <ListView 
          config={config} 
          onRowClick={handleRowClick}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </Card>
  )
}
```

## Troubleshooting

### Data not displaying
- Ensure your data array is properly formatted
- Check that column keys match data object keys
- Verify that `defaultVisibleColumns` contains valid column keys

### Selection not working
- Ensure your data objects have an `id` or `_id` field
- Check that the checkbox event handlers are not being prevented

### Export not downloading
- Ensure at least one row is selected
- Check browser popup blockers
- Verify the CSV generation logic

### Styling issues
- Ensure Tailwind CSS is properly configured
- Check that shadcn/ui components are installed
- Verify component imports are correct

## Future Enhancements

Potential features for future versions:
- Server-side pagination
- Advanced filtering (date ranges, multi-select)
- Column reordering
- Saved filter presets
- Bulk edit functionality
- Drag-and-drop row reordering
- Custom action buttons per row

## License

This component is part of the eCommerce project and follows the project's license.
