# Form

**Category:** Form
**Source:** `@/components/ui/RSuite/Form/Form`

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `checkTrigger` | `CheckTriggerType` |  | 'change' |
| `disabled` | `boolean` |  |  |
| `errorFromContext` | `boolean` |  |  |
| `fluid` | `boolean` |  |  |
| `formDefaultValue` | `V \| null` |  |  |
| `formError` | `E \| null` |  |  |
| `formValue` | `V \| null` |  |  |
| `layout` | `'horizontal' \| 'vertical' \| 'inline'` |  | 'vertical' |
| `model` | `Schema` |  | ://github.com/rsuite/schema-typed |
| `nestedField` | `boolean` |  | false v5.51.0 ```jsx <Form formValue={{ address: { city: 'Shanghai' } }} nestedField>  <FormControl name="address.city" /> </Form> ``` |
| `onChange` | `(formValue: V, event?: React.SyntheticEvent) =\> void` |  |  |
| `onCheck` | `(formError: E) =\> void` |  |  |
| `onError` | `(formError: E) =\> void` |  |  |
| `onReset` | `(formValue: V \| null, event?: React.FormEvent\<HTMLFormElement\>) =\> void` |  |  |
| `onSubmit` | `(formValue: V \| null, event?: React.FormEvent\<HTMLFormElement\>) =\> void` |  |  |
| `plaintext` | `boolean` |  |  |
| `readOnly` | `boolean` |  |  |

> **Extends:** `WithAsProps`

---
*Auto-generated from rsuite type definitions. Refer to [rsuite documentation](https://rsuitejs.com/components/form) for full details.*
