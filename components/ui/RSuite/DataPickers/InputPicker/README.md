# InputPicker

**Category:** Data Pickers
**Source:** `@/components/ui/RSuite/DataPickers/InputPicker`

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `cacheData` | `InputOption\<V\>[]` |  |  |
| `creatable` | `boolean` |  |  |
| `onBlur` | `React.FocusEventHandler` |  |  |
| `onCreate` | `(value: V, item: Option, event: React.SyntheticEvent) =\> void` |  |  |
| `onFocus` | `React.FocusEventHandler` |  |  |
| `renderValue` | `(value: V, item: Option\<V\>, selectedElement: React.ReactNode) =\> React.ReactNode` |  |  |
| `shouldDisplayCreateOption` | `(searchKeyword: string, filteredData: InputOption\<V\>[]) =\> boolean` |  | Value of the textbox The items filtered by the searchKeyword |
| `tabIndex` | `number` |  |  |

> **Extends:** `FormControlPickerProps`

---
*Auto-generated from rsuite type definitions. Refer to [rsuite documentation](https://rsuitejs.com/components/inputpicker) for full details.*
