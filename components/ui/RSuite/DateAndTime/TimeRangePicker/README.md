# TimeRangePicker

**Category:** Date and Time
**Source:** `@/components/ui/RSuite/DateAndTime/TimeRangePicker`

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `caretAs` | `React.ElementType \| null` |  |  |
| `character` | `string` |  | ' ~ ' |
| `editable` | `boolean` |  | true |
| `format` | `string` |  |  |
| `hideHours` | `(hour: number, date: Date) =\> boolean` |  |  |
| `hideMinutes` | `(minute: number, date: Date) =\> boolean` |  |  |
| `hideSeconds` | `(second: number, date: Date) =\> boolean` |  |  |
| `label` | `React.ReactNode` |  |  |
| `loading` | `boolean` |  |  |
| `onClean` | `(event: React.MouseEvent) =\> void` |  |  |
| `onOk` | `(date: DateRange, event: React.SyntheticEvent) =\> void` |  |  |
| `onShortcutClick` | `(range: DateOptionPreset\<DateRange\>, event: React.MouseEvent) =\> void` |  |  |
| `ranges` | `DateOptionPreset\<DateRange \| null\>[]` |  |  |
| `renderTitle` | `(date: Date) =\> React.ReactNode` |  |  |
| `renderValue` | `(value: DateRange, format: string) =\> string` |  |  |
| `showHeader` | `boolean` |  |  |
| `showMeridiem` | `boolean` |  |  |

> **Extends:** `FormControlBaseProps`

---
*Auto-generated from rsuite type definitions. Refer to [rsuite documentation](https://rsuitejs.com/components/timerangepicker) for full details.*
