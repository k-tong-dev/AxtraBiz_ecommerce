# Wizard Component

A reusable multi-step form wizard for guided data entry, similar to Odoo's concept or setup wizards.

## Features

- **Multi-step navigation** — prev/next with validation per step
- **Step indicator** — horizontal or vertical layout with progress bar
- **Per-step validation** — uses `FormViewValidator` from FormView
- **Conditional steps** — show/hide steps based on form data
- **Custom step components** — drop in any React component for a step
- **Field integration** — reuses all Base Field components (`StringField`, `NumberField`, `SelectionField`, etc.)
- **Loading state** — submit button shows "Saving..." during async completion

## Usage

```tsx
import { Wizard } from '@/components/Base/Wizard'
import type { WizardConfig } from '@/components/Base/Wizard'

const config: WizardConfig = {
  steps: [
    {
      key: 'details',
      title: 'Product Details',
      description: 'Enter the basic product information',
      fields: [
        { key: 'name', label: 'Name', type: 'string', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
      ],
      validation: {
        name: { required: true, minLength: 2 },
      },
    },
    {
      key: 'pricing',
      title: 'Pricing',
      description: 'Set the price and stock levels',
      fields: [
        { key: 'price', label: 'Price', type: 'number', required: true },
        { key: 'stock', label: 'Stock', type: 'number' },
      ],
      validation: {
        price: { required: true, min: 0 },
      },
    },
    {
      key: 'summary',
      title: 'Summary',
      description: 'Review your entries before saving',
      // Custom component for the review step
      component: ({ data }) => (
        <div className="space-y-2">
          <p><strong>Name:</strong> {data.name}</p>
          <p><strong>Price:</strong> ${data.price}</p>
        </div>
      ),
    },
  ],
  onComplete: async (data) => {
    await fetch('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  onCancel: () => router.back(),
}

export default function CreateProductPage() {
  return <Wizard config={config} />
}
```

## Configuration

### `WizardConfig`

| Property | Type | Default | Description |
|---|---|---|---|
| `steps` | `WizardStep[]` | — | Array of steps to render |
| `onComplete` | `(data) => void \| Promise<void>` | — | Called when user clicks "Complete" with all form data |
| `onCancel` | `() => void` | — | Called when user clicks "Cancel" |
| `initialData` | `Record<string, any>` | `{}` | Pre-populated form values |
| `submitLabel` | `string` | `'Complete'` | Label for the final submit button |
| `showSteps` | `boolean` | `true` | Show/hide the step indicator |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Step indicator layout |
| `className` | `string` | — | Additional CSS classes |

### `WizardStep`

| Property | Type | Description |
|---|---|---|
| `key` | `string` | Unique step identifier |
| `title` | `string` | Step heading |
| `description` | `string` | Optional subtext below title |
| `icon` | `ReactNode` | Custom icon (defaults to step number) |
| `fields` | `FormField[]` | Fields to render (from `@/components/Base/Views/FormView`) |
| `validation` | `ValidationRules` | Validation rules per field (from `FormViewValidator`) |
| `show` | `(data) => boolean` | Conditional visibility based on form data |
| `component` | `React.ComponentType` | Custom React component instead of fields |

## Validation

Validation follows the `FormViewValidator` pattern from `@/components/Base/Views/FormView/utils/validation`:

```tsx
validation: {
  email: FormViewValidator.email(),
  password: FormViewValidator.password(),
  name: FormViewValidator.combine(
    FormViewValidator.required(),
    FormViewValidator.minLength(2),
  ),
}
```

## Best Practices

1. **Keep steps focused** — each step should represent one logical section
2. **Validate early** — use validation rules to catch errors before the final step
3. **Use custom components** — for complex steps (reviews, file uploads, etc.) use the `component` prop
4. **Lazy initialData** — pass initial data for edit flows
5. **Handle async completion** — `onComplete` supports async for API calls

## Supported Field Types

`string`, `number`, `textarea`, `boolean`, `checkbox`, `toggle`, `selection`, `date`, `datetime`, `time`, `year`, `month`, `day`, `html`, `json`, `array`, `file`, `many2one`, `many2many`, `one2many`
