# Checkbox Field

Checkbox input for boolean values, wrapping RSuite's `Checkbox`.

## Props
- `config`: FieldConfig — field configuration (uses `label`, `readonly`)
- `value`: `boolean` — current checked state
- `onChange`: `(value: boolean) => void`
- `error`: `string | null`

## Example
```typescript
{ name: 'agreeTerms', type: 'checkbox', label: 'I agree to the terms and conditions' }
```
