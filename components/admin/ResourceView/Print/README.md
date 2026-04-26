# Print Component

The Print component allows users to print data from any view (FormView, ListView) with custom template support. It provides a print template page with preview, Google print dialog integration, and PDF export capability. Similar to Odoo 18's print template system, you can create custom print templates by passing your own React component.

## Features

- **Print Modes**: Single record and bulk record printing
- **Custom Templates**: Pass custom React components as print templates
- **Print Preview**: Opens a dedicated print page with preview
- **Google Print Dialog**: Auto-opens browser print dialog for printing
- **PDF Export**: Download as PDF using browser's print-to-PDF
- **Template Registry**: Support for dynamic template loading (extensible)

## Usage

### Basic Integration

The Print component is integrated with ServerActions. When the `print` action is triggered, it opens the print template page in a new tab.

```tsx
import {Print} from './Print'
import {PrintConfig} from './types'

<Print
    config={{
        data: data,
        mode: 'single',
        title: 'Product Print'
    }}
    onClose={() => setShowPrintModal(false)}
/>
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `config` | `PrintConfig` | Print configuration object |
| `onClose` | `() => void` | Callback to close the print modal |

### PrintConfig

```typescript
interface PrintConfig {
    data: any[]           // Data to print
    mode: 'single' | 'bulk'  // Print mode
    template?: React.ComponentType<PrintTemplateProps>  // Custom template component
    title?: string        // Print title
}
```

### PrintTemplateProps

```typescript
interface PrintTemplateProps {
    data: any
    mode: 'single' | 'bulk'
}
```

## Custom Print Templates

You can create custom print templates by creating React components that accept `PrintTemplateProps`.

### Example: Custom Product Template

```tsx
// components/admin/products/ProductPrintTemplate.tsx
import React from 'react'

export function ProductPrintTemplate({data, mode}: {data: any; mode: 'single' | 'bulk'}) {
    const record = Array.isArray(data) ? data[0] : data
    const records = Array.isArray(data) ? data : [data]

    return (
        <div className="bg-transparent min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">Product Details</h1>
                
                {mode === 'single' ? (
                    <div className="border p-6 rounded-lg shadow-sm">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="font-semibold text-gray-600">Name:</label>
                                <p className="text-lg">{record.name}</p>
                            </div>
                            <div>
                                <label className="font-semibold text-gray-600">Price:</label>
                                <p className="text-lg">${record.price}</p>
                            </div>
                            <div>
                                <label className="font-semibold text-gray-600">Category:</label>
                                <p className="text-lg">{record.category}</p>
                            </div>
                            <div>
                                <label className="font-semibold text-gray-600">Stock:</label>
                                <p className="text-lg">{record.stock}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="font-semibold text-gray-600">Description:</label>
                            <p className="text-gray-700">{record.description}</p>
                        </div>
                    </div>
                ) : (
                    <div>
                        {records.map((record, index) => (
                            <div key={index} className="border p-6 rounded-lg shadow-sm mb-4">
                                <h2 className="text-xl font-semibold mb-4">Product #{index + 1}</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="font-semibold text-gray-600">Name:</label>
                                        <p className="text-lg">{record.name}</p>
                                    </div>
                                    <div>
                                        <label className="font-semibold text-gray-600">Price:</label>
                                        <p className="text-lg">${record.price}</p>
                                    </div>
                                    <div>
                                        <label className="font-semibold text-gray-600">Category:</label>
                                        <p className="text-lg">{record.category}</p>
                                    </div>
                                    <div>
                                        <label className="font-semibold text-gray-600">Stock:</label>
                                        <p className="text-lg">{record.stock}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
```

### Using Custom Template in ServerActions

```tsx
import {ProductPrintTemplate} from './ProductPrintTemplate'

const customServerActions = [
    {
        key: 'print_product',
        label: 'Print Product',
        icon: <Printer size={16} />,
        mode: 'both',
        onClick: async (data, context) => {
            // In ServerActions, the print action is handled automatically
            // To use custom template, you would extend the Print component
            // or use a template registry system
        }
    }
]
```

## Integration with Views

### FormView

The Print action is available in FormView's ServerActions dropdown:

```tsx
<FormView
    mode={editingId ? 'edit' : 'create'}
    config={config.formViewConfig}
    entityId={editingId}
    initialData={formInitialData}
    serverActions={mergedServerActions}
/>
```

### ListView

The Print action is available in ListView's bulk actions dropdown:

```tsx
<ListView
    config={config.listViewConfig}
    onRowClick={handleEdit}
    onEdit={handleEdit}
    onDelete={onDelete}
    loading={loading}
    searchValues={searchValues}
    filterValues={filterValues}
    groupByField={groupByField}
    selectedIds={selectedIds}
    setSelectedIds={setSelectedIds}
    serverActions={mergedServerActions}
/>
```

### ResourceView

The Print action is triggered from the bulk actions toolbar when records are selected:

```tsx
{selectedIds.length > 0 && (
    <ServerActions
        actions={mergedServerActions}
        data={currentFilteredData.filter(item => 
            selectedIds.includes(item.id || item._id)
        ) || []}
        context={{
            mode: 'bulk',
            view: 'list',
            selectedIds
        }}
        layout="dropdown"
    />
)}
```

## How It Works

1. User clicks the "Print" action in ServerActions
2. Print component stores data in sessionStorage
3. Print component opens `/print` route in new tab
4. Print page retrieves data from sessionStorage
5. Print page renders the template (default or custom)
6. Browser print dialog auto-opens after 500ms
7. User can print or save as PDF

## Print Page Features

The `/print` page (`app/print/page.tsx`) provides:

- **Toolbar**: Print, Download PDF, and Close buttons (hidden when printing)
- **Auto Print**: Automatically opens print dialog on page load
- **Print Styles**: Toolbar is hidden during printing
- **Template Rendering**: Renders the appropriate template based on mode

## Default Template

The `DefaultPrintTemplate` component provides a simple table-based layout:

- **Single Mode**: Shows one record with key-value pairs in a table
- **Bulk Mode**: Shows multiple records, each in its own section

## Extending with Custom Templates

To add custom templates:

1. Create a React component that accepts `PrintTemplateProps`
2. Style it for print (use print-specific CSS if needed)
3. Register it in a template registry (future enhancement)
4. Pass it to the Print config via the `template` prop

## Print CSS Tips

When creating custom print templates, consider:

- Use `@media print` CSS rules for print-specific styling
- Hide non-print elements with `.print:hidden` class
- Ensure high contrast for readability
- Use appropriate font sizes (12pt+ recommended)
- Test print preview before finalizing

```css
@media print {
    .no-print {
        display: none !important;
    }
    body {
        background: white;
        color: black;
    }
}
```

## Dependencies

- React (for component rendering)
- Browser's native print dialog (for printing)
- Browser's print-to-PDF (for PDF export)

## Future Enhancements

- Template registry system for easy template management
- More sophisticated PDF generation (html2pdf, jsPDF)
- Print preview modal before opening print dialog
- Template selection UI
- Header/footer customization
- Watermark support
