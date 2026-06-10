# Many2Many Field

Multi-selection field that fetches options from an API. Selected values display as removable badges with optional avatar.

## Props
Same as FieldProps with config requiring `fetchUrl`.

## Config
- `fetchUrl`: `string` — API endpoint to fetch related records
- `default`: `string[]` — default pre-selected record IDs

## Value Format
- Input: `string[]` (array of record IDs) or `{ id, name, avatar? }[]` (initial relation data)
- Output: `string[]` (selected record IDs)

## Avatar Resolution
Options display an avatar if the API response includes one of these fields (checked in order):
`avatar` > `image` > `thumbnail` > `logo_url` > `image_id?.url`

Your API should return items with one of these fields:
```typescript
// Example API response
[
  { id: 1, name: 'Shop A', logo_url: '/api/files/logo-a.png' },
  { id: 2, name: 'Shop B', logo_url: null }
]
```

## Pre-selected Values
Configure default badges by passing IDs in `default`:
```typescript
{
    name: 'tags',
    type: 'many2many',
    label: 'Tags',
    fetchUrl: '/api/tags',
    default: ['1', '3']
}
```

## Example
```typescript
{ name: 'product_ids', type: 'many2many', label: 'Products',
  fetchUrl: '/api/products' }
```
