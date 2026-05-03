# Field Widgets Architecture

A flexible widget system for rendering custom field types in FormView and ListView, inspired by Odoo's field widget system.

## Overview

Field widgets allow you to customize how specific field types are rendered in forms and lists. This is particularly useful for:
- Many-to-many relationships with editable tables
- Many-to-one relationships with searchable selects
- One-to-many relationships with inline editing
- Custom data visualization
- Complex input components

## Architecture

### Widget Interface

```typescript
export interface FieldWidgetProps {
  value: any
  onChange: (value: any) => void
  field: FormField
  data: any  // Full form data
  disabled?: boolean
  readonly?: boolean
}

export interface FieldWidgetComponent extends React.FC<FieldWidgetProps> {
  widgetName: string
}
```

### Available Widgets

1. **many2many_list** - Editable table for many-to-many relationships
2. **many2one** - Searchable select for many-to-one relationships
3. **one2many** - Editable list for one-to-many relationships

## Usage in FormView

To use a widget in a field configuration:

```typescript
{
  key: 'attribute_ids',
  label: 'Product Attributes',
  type: 'json',  // or 'array'
  widget: 'many2many_list',
  widgetConfig: {
    relation: 'product.attributes',
    displayField: 'name',
    columns: [
      { key: 'name', title: 'Name', width: 200 },
      { key: 'type', title: 'Type', width: 150 }
    ]
  }
}
```

## Creating Custom Widgets

### Step 1: Create Widget Component

```typescript
// components/admin/ResourceView/FieldWidgets/MyCustomWidget.tsx
import React from 'react'
import { FieldWidgetProps } from '../index'

export const MyCustomWidget: React.FC<FieldWidgetProps> = ({
  value,
  onChange,
  field,
  data,
  disabled,
  readonly
}) => {
  return (
    <div>
      {/* Your custom widget implementation */}
    </div>
  )
}

MyCustomWidget.widgetName = 'my_custom_widget'
```

### Step 2: Register Widget

```typescript
// components/admin/ResourceView/FieldWidgets/index.ts
import { MyCustomWidget } from './MyCustomWidget'

export const fieldWidgets = {
  my_custom_widget: MyCustomWidget,
  // ... other widgets
}
```

### Step 3: Use in Field Config

```typescript
{
  key: 'my_field',
  label: 'My Field',
  type: 'text',
  widget: 'my_custom_widget'
}
```

## Widget Configuration

### many2many_list

```typescript
{
  widget: 'many2many_list',
  widgetConfig: {
    relation: 'product.attributes',  // API endpoint for related records
    displayField: 'name',           // Field to display in table
    columns: [                      // Table columns
      { key: 'name', title: 'Name', width: 200 },
      { key: 'type', title: 'Type', width: 150 }
    ],
    editable: true,                 // Allow inline editing
    sortable: true,                 // Allow column sorting
    searchable: true                // Allow searching
  }
}
```

### many2one

```typescript
{
  widget: 'many2one',
  widgetConfig: {
    relation: 'product.categories',  // API endpoint
    displayField: 'name',           // Field to display
    searchable: true,               // Enable search
    createable: true                 // Allow creating new records
  }
}
```

### one2many

```typescript
{
  widget: 'one2many',
  widgetConfig: {
    relation: 'order.items',         // API endpoint
    displayField: 'name',           // Field to display
    columns: [                      // Table columns
      { key: 'name', title: 'Name', width: 200 },
      { key: 'quantity', title: 'Qty', width: 100 }
    ],
    editable: true,
    allowAdd: true,
    allowDelete: true
  }
}
```

## Integration with FormView

FormView automatically detects the `widget` property in field configurations and renders the appropriate widget component.

```typescript
// In FormView.tsx
const renderField = (field: FormField) => {
  if (field.widget && fieldWidgets[field.widget]) {
    const WidgetComponent = fieldWidgets[field.widget]
    return (
      <WidgetComponent
        value={data[field.key]}
        onChange={(value) => setData({ ...data, [field.key]: value })}
        field={field}
        data={data}
        disabled={field.readonly}
        readonly={field.readonly}
      />
    )
  }
  
  // Default field rendering
  // ...
}
```

## Best Practices

1. **Keep Widgets Focused**: Each widget should handle one specific use case
2. **Use TypeScript**: Ensure proper typing for props and configuration
3. **Handle Loading States**: Widgets should handle async data loading gracefully
4. **Error Handling**: Provide clear error messages when operations fail
5. **Accessibility**: Ensure widgets are keyboard navigable and screen reader friendly
6. **Performance**: Use React.memo for expensive widgets
7. **Testing**: Write unit tests for widget components

## Future Enhancements

- [ ] Add more built-in widgets (date_range, color_picker, file_upload, etc.)
- [ ] Widget validation integration
- [ ] Widget-specific configuration UI
- [ ] Widget marketplace for community contributions
- [ ] Widget composition (nesting widgets)
- [ ] Widget state persistence
