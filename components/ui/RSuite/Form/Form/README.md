# Form

**Category:** Form
**Source:** `@/components/ui/RSuite/Form/Form`

## Props

| Prop | Type | Required | Inherited From | Description |
|------|------|----------|----------------|-------------|
| `checkTrigger` | `CheckTriggerType` |  | `FormProps` | 'change' |
| `disabled` | `boolean` |  | `FormProps` |  |
| `errorFromContext` | `boolean` |  | `FormProps` |  |
| `fluid` | `boolean` |  | `FormProps` |  |
| `formDefaultValue` | `V \| null` |  | `FormProps` |  |
| `formError` | `E \| null` |  | `FormProps` |  |
| `formValue` | `V \| null` |  | `FormProps` |  |
| `layout` | `'horizontal' \| 'vertical' \| 'inline'` |  | `FormProps` | 'vertical' |
| `model` | `Schema` |  | `FormProps` | ://github.com/rsuite/schema-typed |
| `nestedField` | `boolean` |  | `FormProps` | false v5.51.0 ```jsx <Form formValue={{ address: { city: 'Shanghai' } }} nestedField>  <FormControl name="address.city" /> </Form> ``` |
| `onChange` | `(formValue: V,  event?: React.SyntheticEvent) =\> void` |  | `FormProps` |  |
| `onCheck` | `(formError: E) =\> void` |  | `FormProps` |  |
| `onError` | `(formError: E) =\> void` |  | `FormProps` |  |
| `onReset` | `(formValue: V \| null,  event?: React.FormEvent\<HTMLFormElement\>) =\> void` |  | `FormProps` |  |
| `onSubmit` | `(formValue: V \| null,  event?: React.FormEvent\<HTMLFormElement\>) =\> void` |  | `FormProps` |  |
| `plaintext` | `boolean` |  | `FormProps` |  |
| `readOnly` | `boolean` |  | `FormProps` |  |
| `as` | `As` |  | `WithAsProps` |  |
| `children` | `ReactNode` |  | `WithAsProps` |  |
| `className` | `string` |  | `WithAsProps` |  |
| `classPrefix` | `string` |  | `WithAsProps` |  |
| `style` | `CSSProperties` |  | `WithAsProps` |  |

---
*Auto-generated from rsuite type definitions. Refer to [rsuite documentation](https://rsuitejs.com/components/form/#props) for full details.*
