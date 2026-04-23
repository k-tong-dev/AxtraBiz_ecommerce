import React from 'react'
import { ListViewConfig, ListColumn, BulkActionConfig } from '@/components/admin/ResourceView/ListView'
import { Trash2, Package, AlertTriangle } from 'lucide-react'
import { createElement } from 'react'

export const getProductListConfig = (data: any[] = [], onDelete?: (rowData: any) => void): ListViewConfig => ({
  title: 'Products',
  data: data,
  showColumnToggle: false,  // Disabled when using ResourceView
  showSearch: false,        // Disabled when using ResourceView
  showFilters: false,       // Disabled when using ResourceView
  showViewSwitcher: false,  // Disabled when using ResourceView
  showExport: false,        // Disabled when using ResourceView
  defaultVisibleColumns: [
    'name',
    'sku',
    'price',
    'stock',
    'product_type',
    'status',
    'active'
  ],
  pageSize: 5,
  bulkActions: [
    {
      label: 'Delete Selected',
      icon: createElement(Trash2, { size: 16 }),
      color: 'red',
      confirm: (selectedIds: string[], selectedData: any[]) => {
        return `Are you sure you want to delete ${selectedIds.length} product(s)? This action cannot be undone.`
      },
      helper: 'Permanently remove selected products from the catalog',
      onClick: (selectedIds: string[], selectedData: any[]) => {
        if (onDelete) {
          selectedData.forEach(item => onDelete(item))
        }
      }
    },
    {
      label: 'Apply Stock',
      icon: createElement(Package, { size: 16 }),
      color: 'green',
      confirm: 'Apply stock adjustments to selected products?',
      helper: 'Update inventory levels for selected products',
      onClick: (selectedIds: string[], selectedData: any[]) => {
        console.log('Apply stock to:', selectedIds)
        // Custom logic to apply stock to selected products
      }
    },
    {
      label: 'Mark as Low Stock',
      icon: createElement(AlertTriangle, { size: 16 }),
      color: 'orange',
      show: (selectedIds: string[], selectedData: any[]) => {
        // Only show if at least one item has stock < 10
        return selectedData.some(item => item.stock < 10)
      },
      confirm: (selectedIds: string[], selectedData: any[]) => {
        return `Mark ${selectedIds.length} product(s) as low stock?`
      },
      helper: 'Flag products as low stock for reordering',
      onClick: (selectedIds: string[], selectedData: any[]) => {
        console.log('Mark as low stock:', selectedIds)
        // Custom logic to mark items as low stock
      }
    }
  ],
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
      key: 'sku',
      title: 'SKU',
      width: 120,
      resizable: true,
      sortable: true,
      filterable: true,
      filterType: 'text',
      align: 'left'
    },
    {
      key: 'price',
      title: 'Price ( $ )',
      width: 100,
      resizable: true,
      sortable: true,
      filterable: true,
      filterType: 'number',
      align: 'right',
      isNumber: true,
      summary: true,
      summaryType: 'sum',
      render: (value: any) => `$${parseFloat(value).toFixed(2)}`
    },
    {
      key: 'compare_price',
      title: 'Compare Price',
      width: 120,
      resizable: true,
      sortable: true,
      filterable: true,
      filterType: 'number',
      align: 'right',
      render: (value: any) => value ? `$${parseFloat(value).toFixed(2)}` : '-'
    },
    {
      key: 'cost_price',
      title: 'Cost Price',
      width: 120,
      resizable: true,
      sortable: true,
      filterable: true,
      filterType: 'number',
      align: 'right',
      render: (value: any) => value ? `$${parseFloat(value).toFixed(2)}` : '-'
    },
    {
      key: 'stock',
      title: 'Stock',
      width: 80,
      resizable: true,
      sortable: true,
      filterable: true,
      filterType: 'number',
      align: 'center',
      isNumber: true,
      summary: true,
      summaryType: 'sum',
      render: (value: any) => {
        const stock = parseInt(value)
        if (stock <= 0) return React.createElement('span', { className: 'text-red-500 font-semibold' }, stock)
        if (stock < 10) return React.createElement('span', { className: 'text-yellow-500 font-semibold' }, stock)
        return React.createElement('span', { className: 'text-green-500' }, stock)
      }
    },
    {
      key: 'product_type',
      title: 'Type',
      width: 100,
      resizable: true,
      sortable: true,
      filterable: true,
      filterType: 'options',
      filterOptions: [
        { label: 'Simple', value: 'simple' },
        { label: 'Variable', value: 'variable' },
        { label: 'Grouped', value: 'grouped' }
      ],
      align: 'center',
      render: (value: any) => {
        const typeMap: Record<string, string> = {
          simple: 'Simple',
          variable: 'Variable',
          grouped: 'Grouped'
        }
        return typeMap[value] || value
      }
    },
    {
      key: 'status',
      title: 'Status',
      width: 100,
      resizable: true,
      sortable: true,
      filterable: true,
      filterType: 'options',
      filterOptions: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' }
      ],
      align: 'center',
      render: (value: any) => {
        const statusColors: Record<string, string> = {
          draft: 'gray',
          published: 'green',
          archived: 'red'
        }
        const color = statusColors[value] || 'gray'
        return React.createElement('span', { className: `bg-${color}-100 text-${color}-800 px-2 py-1 rounded text-xs font-medium capitalize` }, value)
      }
    },
    {
      key: 'active',
      title: 'Active',
      width: 80,
      resizable: true,
      sortable: true,
      filterable: true,
      filterType: 'boolean',
      filterDefault: true,
      align: 'center',
      render: (value: any) => React.createElement('span', { className: value ? 'text-green-500' : 'text-red-500' }, value ? 'TRUE' : 'FALSE')
    },
    {
      key: 'category_id',
      title: 'Category',
      width: 150,
      resizable: true,
      sortable: true,
      filterable: true,
      filterType: 'text',
      align: 'left'
    },
    {
      key: 'brand_id',
      title: 'Brand',
      width: 120,
      resizable: true,
      sortable: true,
      filterable: true,
      filterType: 'text',
      align: 'left'
    },
    {
      key: 'weight',
      title: 'Weight',
      width: 100,
      resizable: true,
      sortable: true,
      filterable: true,
      filterType: 'number',
      align: 'right',
      render: (value: any) => value ? `${parseFloat(value).toFixed(2)} kg` : '-'
    },
    {
      key: 'track_inventory',
      title: 'Track Inv',
      width: 100,
      resizable: true,
      sortable: true,
      filterable: true,
      filterType: 'boolean',
      align: 'center',
      render: (value: any) => React.createElement('span', { className: value ? 'text-green-500' : 'text-gray-500' }, value ? 'Yes' : 'No')
    },
    {
      key: 'allow_backorders',
      title: 'Backorders',
      width: 100,
      resizable: true,
      sortable: true,
      filterable: true,
      filterType: 'boolean',
      align: 'center',
      render: (value: any) => React.createElement('span', { className: value ? 'text-green-500' : 'text-gray-500' }, value ? 'Yes' : 'No')
    },
    {
      key: 'created_at',
      title: 'Created',
      width: 150,
      resizable: true,
      sortable: true,
      filterable: true,
      filterType: 'date',
      align: 'left',
      render: (value: any) => new Date(value).toLocaleDateString()
    },
    {
      key: 'updated_at',
      title: 'Updated',
      width: 150,
      resizable: true,
      sortable: true,
      filterable: true,
      filterType: 'date',
      align: 'left',
      render: (value: any) => new Date(value).toLocaleDateString()
    }
  ],
})
