# Many2One Field

Single-selection field that fetches options from an API. Displays avatar+name for selected value.

## Props
Same as FieldProps with config requiring `fetchUrl`.

## Config
- `fetchUrl`: `string` — API endpoint to fetch related records
- `default`: `string | null` — default selected record ID

## Value Format
- Input: `string | null` (record ID)
- Output: `string | null` (selected record ID)

## Avatar Resolution
The dropdown and selected value display an avatar if the API response includes one of these fields (checked in order):
`avatar` > `image` > `thumbnail` > `logo_url` > `image_id?.url`

Your API should return items with one of these fields:
```typescript
// Example API response
[
  { id: 1, name: 'Shop A', logo_url: '/api/files/logo-a.png' },
  { id: 2, name: 'Shop B', logo_url: null }
]
```

## Example
```typescript
{ name: 'customer_id', type: 'many2one', label: 'Customer',
  fetchUrl: '/api/customers' }
```
