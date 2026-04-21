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
    'product_type',
    'status',
    'active'
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
      title: 'Price',
      width: 100,
      resizable: true,
      sortable: true,
      filterable: true,
      filterType: 'number',
      align: 'right',
      render: (value) => `$${parseFloat(value).toFixed(2)}`
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
      render: (value) => value ? `$${parseFloat(value).toFixed(2)}` : '-'
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
      render: (value) => value ? `$${parseFloat(value).toFixed(2)}` : '-'
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
      render: (value) => {
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
      render: (value) => {
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
      render: (value) => {
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
      align: 'center',
      render: (value) => React.createElement('span', { className: value ? 'text-green-500' : 'text-red-500' }, value ? 'Yes' : 'No')
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
      render: (value) => value ? `${parseFloat(value).toFixed(2)} kg` : '-'
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
      render: (value) => React.createElement('span', { className: value ? 'text-green-500' : 'text-gray-500' }, value ? 'Yes' : 'No')
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
      render: (value) => React.createElement('span', { className: value ? 'text-green-500' : 'text-gray-500' }, value ? 'Yes' : 'No')
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
      render: (value) => new Date(value).toLocaleDateString()
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
      render: (value) => new Date(value).toLocaleDateString()
    }
  ]
})
