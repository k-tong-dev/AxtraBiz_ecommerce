# Search Component

A flexible, field-based search component for ResourceView that supports searching by specific fields with tag-based visualization.

## Features

- **Field-based Search**: Search by specific fields (name, price, phone, etc.) or search across all fields
- **Tag-based UI**: Search terms are displayed as tags with close buttons for easy removal
- **Multiple Search Terms**: Add multiple search criteria with OR logic
- **Field Selector**: Dropdown to select which field to search in
- **Keyboard Support**: Press Enter to add search terms
- **Clear Input**: X button to clear current input
- **Customizable**: Configurable fields, placeholder, width, and styling

## Props

### SearchProps

| Prop             | Type                              | Default       | Description                        |
|------------------|-----------------------------------|---------------|------------------------------------|
| `fields`         | `SearchField[]`                   | `[]`          | Array of searchable fields         |
| `onSearchChange` | `(values: SearchValue[]) => void` | `undefined`   | Callback when search values change |
| `placeholder`    | `string`                          | `"Search..."` | Input placeholder text             |
| `width`          | `number`                          | `200`         | Input width in pixels              |
| `className`      | `string`                          | `""`          | Additional CSS classes             |

### SearchField

| Property | Type                           | Required | Description                                         |
|----------|--------------------------------|----------|-----------------------------------------------------|
| `key`    | `string`                       | Yes      | Unique field identifier (e.g., "name", "price")     |
| `label`  | `string`                       | Yes      | Display label for the field (e.g., "Name", "Price") |
| `type`   | `'text' \| 'number' \| 'date'` | No       | Field type for future validation (default: 'text')  |

### SearchValue

| Property   | Type     | Description                                        |
|------------|----------|----------------------------------------------------|
| `fieldKey` | `string` | The field being searched (or "all" for all fields) |
| `value`    | `string` | The search value                                   |

## Usage

### Basic Usage (All Fields)

```tsx
import {Search} from '@/components/admin/ResourceView/Search'

function MyComponent() {
  const handleSearchChange = (values) => {
    console.log('Search values:', values)
    // values: [{ fieldKey: 'all', value: 'search term' }]
  }

  return (
    <Search onSearchChange={handleSearchChange} />
  )
}
```

### Field-based Search

```tsx
import {Search} from '@/components/admin/ResourceView/Search'

function MyComponent() {
  const searchFields = [
    { key: 'name', label: 'Name' },
    { key: 'price', label: 'Price', type: 'number' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' }
  ]

  const handleSearchChange = (values) => {
    console.log('Search values:', values)
    // values: [
    //   { fieldKey: 'name', value: 'John' },
    //   { fieldKey: 'price', value: '100' }
    // ]
  }

  return (
    <Search 
      fields={searchFields}
      onSearchChange={handleSearchChange}
      placeholder="Search products..."
      width={300}
    />
  )
}
```

### Integration with ResourceView

```tsx
import {Search} from '@/components/admin/ResourceView/Search'

export function ResourceView({config, ...props}: ResourceViewProps) {
  const [searchValues, setSearchValues] = useState<SearchValue[]>([])

  // Define searchable fields from ListView config
  const searchFields = config.listViewConfig?.columns
    .filter(col => col.searchable !== false)
    .map(col => ({
      key: col.key,
      label: col.title,
      type: col.dataType
    })) || []

  const handleSearchChange = (values: SearchValue[]) => {
    setSearchValues(values)
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <Search 
          fields={searchFields}
          onSearchChange={handleSearchChange}
        />
      </div>
      {/* Pass searchValues to ListView for filtering */}
      <ListView 
        config={config.listViewConfig}
        searchValues={searchValues}
        {...props}
      />
    </div>
  )
}
```

## Behavior

### Adding Search Terms

1. Select a field from the dropdown (or "All Fields" for global search)
2. Type a search term in the input
3. Press Enter or click to add the term as a tag
4. The tag appears with the field name and value

### Removing Search Terms

- Click the X button on a tag to remove it
- Click the X button in the input to clear the current input

### Field Selection

- If no fields are provided, defaults to "All Fields" mode
- If fields are provided, a dropdown appears to select the search field
- "All Fields" option is always available when fields are provided

### Search Value Updates

- The `onSearchChange` callback is called whenever search values are added or removed
- The callback receives an array of `SearchValue` objects
- Parent components can use these values to filter data

## Styling

The component uses:
- RSuite `Tag` component for search tags (violet color)
- Custom `InputGroup` for the input field
- Lucide icons for search and clear buttons
- Tailwind CSS for layout and spacing

Custom styles can be applied via the `className` prop.

## Future Enhancements

- Field type validation (number range, date picker)
- Search history/saved searches
- Advanced operators (contains, equals, greater than, etc.)
- Debounced search for performance
- Keyboard shortcuts for quick field selection
