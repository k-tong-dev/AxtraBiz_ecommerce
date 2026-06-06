# DatePicker

**Category:** Date and Time
**Source:** `@/components/ui/RSuite/DateAndTime/DatePicker`

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `calendarDefaultDate` | `Date` |  |  |
| `caretAs` | `React.ElementType \| null` |  |  |
| `disabled` | `boolean` |  |  |
| `editable` | `boolean` |  |  |
| `format` | `string` |  |  |
| `hideHours` | `(hour: number, date: Date) =\> boolean` |  |  |
| `hideMinutes` | `(minute: number, date: Date) =\> boolean` |  |  |
| `hideSeconds` | `(second: number, date: Date) =\> boolean` |  |  |
| `isoWeek` | `boolean` |  | ://en.wikipedia.org/wiki/ISO_week_date |
| `label` | `React.ReactNode` |  |  |
| `limitEndYear` | `number` |  |  |
| `limitStartYear` | `number` |  |  |
| `loading` | `boolean` |  |  |
| `monthDropdownProps` | `MonthDropdownProps` |  |  |
| `onChangeCalendarDate` | `(date: Date, event?: React.SyntheticEvent) =\> void` |  |  |
| `onClean` | `(event: React.MouseEvent) =\> void` |  |  |
| `oneTap` | `boolean` |  |  |
| `onNextMonth` | `(date: Date) =\> void` |  |  |
| `onOk` | `(date: Date, event: React.SyntheticEvent) =\> void` |  |  |
| `onPrevMonth` | `(date: Date) =\> void` |  |  |
| `onSelect` | `(date: Date, event?: React.SyntheticEvent) =\> void` |  |  |
| `onShortcutClick` | `(range: DateOptionPreset\<Date\>, event: React.MouseEvent) =\> void` |  |  |
| `onToggleMonthDropdown` | `(toggle: boolean) =\> void` |  |  |
| `onToggleTimeDropdown` | `(toggle: boolean) =\> void` |  |  |
| `plaintext` | `boolean` |  |  |
| `ranges` | `DateOptionPreset\<Date \| null\>[]` |  |  |
| `readOnly` | `boolean` |  |  |
| `renderCell` | `(date: Date) =\> React.ReactNode` |  | 5.54.0 |
| `renderValue` | `(value: Date, format: string) =\> string` |  |  |
| `shouldDisableDate` | `(date: Date) =\> boolean` |  | date should be disabled (not selectable) |
| `shouldDisableHour` | `(hour: number, date: Date) =\> boolean` |  |  |
| `shouldDisableMinute` | `(minute: number, date: Date) =\> boolean` |  |  |
| `shouldDisableSecond` | `(second: number, date: Date) =\> boolean` |  |  |
| `showMeridian` | `boolean` |  | Use `showMeridiem` instead |
| `showMeridiem` | `boolean` |  |  |
| `showWeekNumbers` | `boolean` |  |  |
| `weekStart` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` |  | 0 |

> **Extends:** `FormControlBaseProps`

---
*Auto-generated from rsuite type definitions. Refer to [rsuite documentation](https://rsuitejs.com/components/datepicker) for full details.*
