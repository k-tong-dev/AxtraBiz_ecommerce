import {FormConfig} from '../FormView'
import type {Product} from '@/lib/drizzle/server'

export const productFormConfig: FormConfig = {
    entityName: 'Product',
    entityNamePlural: 'Products',
    apiEndpoint: '/api/products',
    fields: [
        // Media & Files Section - Always first
        {
            key: 'images',
            label: 'Product Images',
            type: 'file',
            required: false,
            placeholder: 'Upload product images',
            gridCols: 1,
            order: 1  // First field
        },

        // Basic Information Section - Ordered fields
        {
            key: 'name',
            label: 'Product Name',
            type: 'text',
            required: true,
            placeholder: 'Enter product name',
            validation: (value) => {
                if (!value || value.trim().length < 2) return 'Product name must be at least 2 characters'
                return null
            },
            rows: 1,
            gridCols: 2,
            gridRow: 1,
            gridColumn: 1,
            order: 2  // Second field
        },
        {
            key: 'slug',
            label: 'Slug',
            type: 'text',
            required: true,
            placeholder: 'Enter slug',
            validation: (value) => {
                if (!value || value.trim().length < 2) return 'Product slug must be at least 2 characters'
                return null
            },
            rows: 1,
            gridCols: 1,
            gridRow: 1,
            gridColumn: 1,
            order: 3  // Second field
        },
        {
            key: 'barcode',
            label: 'Barcode',
            type: 'text',
            required: false,
            placeholder: 'Enter Barcode',
            rows: 1,
            gridCols: 2,
            gridRow: 1,
            gridColumn: 1,
            order: 4
        },
        {
            key: 'category',
            label: 'Category',
            type: 'select',
            required: true,
            placeholder: 'Select category',
            options: [
                {label: 'General', value: 'General'},
                {label: 'Electronics', value: 'Electronics'},
                {label: 'Clothing', value: 'Clothing'},
                {label: 'Books', value: 'Books'},
                {label: 'Home & Garden', value: 'Home & Garden'},
                {label: 'Sports', value: 'Sports'},
                {label: 'Toys', value: 'Toys'},
                {label: 'Food', value: 'Food'},
                {label: 'Health', value: 'Health'},
                {label: 'Beauty', value: 'Beauty'}
            ],
            gridCols: 1,
            gridRow: 1,
            gridColumn: 2,
            order: 5
        },
        {
            key: 'description',
            label: 'Description',
            type: 'textarea',
            required: false,
            placeholder: 'Enter detailed product description',
            rows: 3,
            gridCols: 3,
            gridRow: 2,
            gridColumn: 1,
            order: 4  // Fourth field
        },

        // Pricing Section - Ordered fields
        {
            key: 'price',
            label: 'Sale Price',
            type: 'number',
            required: true,
            placeholder: '0.00',
            validation: (value) => {
                if (value < 0) return 'Price must be greater than or equal to 0'
                if (value > 999999.99) return 'Price cannot exceed 999,999.99'
                return null
            },
            gridCols: 1,
            gridRow: 3,
            gridColumn: 1,
            order: 5  // Fifth field
        },
        {
            key: 'compare_price',
            label: 'Compare Price',
            type: 'number',
            required: false,
            placeholder: '0.00',
            validation: (value) => {
                if (value && value < 0) return 'Compare price must be greater than or equal to 0'
                if (value > 999999.99) return 'Compare price cannot exceed 999,999.99'
                return null
            },
            gridCols: 1,
            gridRow: 3,
            gridColumn: 2,
            order: 6  // Sixth field
        },
        {
            key: 'cost_price',
            label: 'Cost Price',
            type: 'number',
            required: false,
            placeholder: '0.00',
            validation: (value) => {
                if (value && value < 0) return 'Cost price must be greater than or equal to 0'
                if (value > 999999.99) return 'Cost price cannot exceed 999,999.99'
                return null
            },
            gridCols: 1,
            gridRow: 3,
            gridColumn: 3,
            order: 7  // Seventh field
        },

        // Inventory Section - Proper grid layout
        {
            key: 'sku',
            label: 'SKU (Stock Keeping Unit)',
            type: 'text',
            required: false,
            placeholder: 'Enter SKU',
            validation: (value) => {
                if (value && !/^[A-Z0-9-]+$/.test(value)) return 'SKU can only contain uppercase letters and numbers'
                return null
            },
            gridCols: 2,
            gridRow: 4,
            gridColumn: 1,
            order: 8  // Eighth field
        },
        {
            key: 'stock',
            label: 'Stock Quantity',
            readonly: true,
            type: 'number',
            required: false,
            placeholder: '0',
            validation: (value) => {
                if (value < 0) return 'Stock must be greater than or equal to 0'
                if (value > 999999) return 'Stock cannot exceed 999,999'
                return null
            },
            gridCols: 1,
            gridRow: 4,
            gridColumn: 2,
            order: 9  // Ninth field
        },
        {
            key: 'weight',
            label: 'Weight (kg)',
            type: 'number',
            required: false,
            placeholder: '0.0',
            validation: (value) => {
                if (value && value < 0) return 'Weight must be greater than or equal to 0'
                if (value > 1000) return 'Weight cannot exceed 1000 kg'
                return null
            },
            gridCols: 1,
            gridRow: 5,
            gridColumn: 1,
            order: 10  // Tenth field
        },
        {
            key: 'dimensions',
            label: 'Dimensions (L×W×H)',
            type: 'text',
            required: false,
            placeholder: 'Length × Width × Height (cm)',
            validation: (value) => {
                if (value && !/^\d+\s*×\s*\d+\s*×\s*\d+$/.test(value)) return 'Please enter valid dimensions (e.g., 10 × 20 × 5)'
                return null
            },
            gridCols: 2,
            gridRow: 5,
            gridColumn: 1,
            order: 11  // Eleventh field
        },
        {
            key: 'active',
            label: 'Active Status',
            type: 'toggle',
            required: false,
            gridCols: 1,
            gridRow: 1,
            gridColumn: 1,
            order: 12  // Twelfth field
        }
    ],
    actions: {
        print: true,
        export: true,
        duplicate: true,
        copy: true,
        archive: false,
        delete: true
    },
    customActions: [
        {
            key: 'update-stock',
            label: 'Update Stock',
            icon: '📦',
            onClick: (data) => {
                console.log('Update Stock for:', data)
                // TODO: Implement stock update logic
            },
            mode: 'edit',
            badge: 4,
            variant: 'default'
        }
    ],
    breadcrumbs: {
        base: '/admin',
        list: '/admin/products',
        create: '/admin/products/new',
        edit: '/admin/products'
    }
}

export type ProductFormConfig = typeof productFormConfig
