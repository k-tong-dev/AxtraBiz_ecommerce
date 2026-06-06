# DateRangePicker

**Category:** Date and Time
**Source:** `@/components/ui/RSuite/DateAndTime/DateRangePicker`

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `calendarSnapping` | `boolean` |  | false 5.69.0 |
| `caretAs` | `React.ElementType \| null` |  |  |
| `character` | `string` |  | ' ~ ' |
| `defaultCalendarValue` | `DateRange` |  |  |
| `disabledDate` | `DisabledDateFunction` |  | [object Object],[object Object],[object Object] |
| `editable` | `boolean` |  | true |
| `format` | `string` |  |  |
| `hideHours` | `(hour: number, date: Date) =\> boolean` |  |  |
| `hideMinutes` | `(minute: number, date: Date) =\> boolean` |  |  |
| `hideSeconds` | `(second: number, date: Date) =\> boolean` |  |  |
| `hoverRange` | `'week' \| 'month' \| ((date: Date) =\> DateRange)` |  |  |
| `isoWeek` | `boolean` |  | ://en.wikipedia.org/wiki/ISO_week_date |
| `label` | `React.ReactNode` |  |  |
| `limitEndYear` | `number` |  | 1000 |
| `limitStartYear` | `number` |  |  |
| `loading` | `boolean` |  |  |
| `monthDropdownProps` | `MonthDropdownProps` |  |  |
| `onClean` | `(event: React.MouseEvent) =\> void` |  |  |
| `oneTap` | `boolean` |  |  |
| `onOk` | `(date: DateRange, event: React.SyntheticEvent) =\> void` |  |  |
| `onSelect` | `(date: Date, event?: React.SyntheticEvent) =\> void` |  |  |
| `onShortcutClick` | `(range: DateOptionPreset\<DateRange\>, event: React.MouseEvent) =\> void` |  |  |
| `ranges` | `DateOptionPreset\<DateRange \| null\>[]` |  |  |
| `renderCell` | `(date: Date) =\> React.ReactNode` |  | 5.77.0 |
| `renderTitle` | `(date: Date, calendarKey: 'start' \| 'end') =\> React.ReactNode` |  |  |
| `renderValue` | `(value: DateRange, format: string) =\> string` |  |  |
| `shouldDisableDate` | `DisabledDateFunction` |  |  |
| `shouldDisableHour` | `(hour: number, date: Date) =\> boolean` |  |  |
| `shouldDisableMinute` | `(minute: number, date: Date) =\> boolean` |  |  |
| `shouldDisableSecond` | `(second: number, date: Date) =\> boolean` |  |  |
| `showHeader` | `boolean` |  | true 5.52.0 |
| `showMeridian` | `boolean` |  | Use `showMeridiem` instead |
| `showMeridiem` | `boolean` |  |  |
| `showOneCalendar` | `boolean` |  |  |
| `showWeekNumbers` | `boolean` |  |  |
| `weekStart` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` |  | 0 |

> **Extends:** `FormControlBaseProps`

---
*Auto-generated from rsuite type definitions. Refer to [rsuite documentation](https://rsuitejs.com/components/daterangepicker) for full details.*
