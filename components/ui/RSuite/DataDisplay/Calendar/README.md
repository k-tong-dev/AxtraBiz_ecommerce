# Calendar

**Category:** Data Display
**Source:** `@/components/ui/RSuite/DataDisplay/Calendar`

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `bordered` | `boolean` |  |  |
| `cellClassName` | `(date: Date) =\> string \| undefined` |  |  |
| `compact` | `boolean` |  |  |
| `defaultValue` | `Date` |  |  |
| `isoWeek` | `boolean` |  | ://en.wikipedia.org/wiki/ISO_week_date |
| `locale` | `CalendarLocale` |  | ://rsuitejs.com/guide/i18n/#calendar |
| `monthDropdownProps` | `MonthDropdownProps` |  |  |
| `onChange` | `(date: Date) =\> void` |  |  |
| `onMonthChange` | `(date: Date) =\> void` |  | Change signature to `onMonthChange(year: number, month: number, reason: string)`? |
| `onSelect` | `(date: Date) =\> void` |  |  |
| `renderCell` | `(date: Date) =\> React.ReactNode` |  |  |
| `value` | `Date` |  |  |
| `weekStart` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` |  | 0 |

> **Extends:** `BoxProps`

---
*Auto-generated from rsuite type definitions. Refer to [rsuite documentation](https://rsuitejs.com/components/calendar) for full details.*
