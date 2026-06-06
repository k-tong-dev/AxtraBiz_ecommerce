# DateRangePicker

**Category:** Date and Time
**Source:** `@/components/ui/RSuite/DateAndTime/DateRangePicker`

## Props

| Prop | Type | Required | Inherited From | Description |
|------|------|----------|----------------|-------------|
| `calendarSnapping` | `boolean` |  | `DateRangePickerProps` | false 5.69.0 |
| `caretAs` | `React.ElementType \| null` |  | `DateRangePickerProps` |  |
| `character` | `string` |  | `DateRangePickerProps` | ' ~ ' |
| `defaultCalendarValue` | `DateRange` |  | `DateRangePickerProps` |  |
| `disabledDate` | `DisabledDateFunction` |  | `DateRangePickerProps` | [object Object],[object Object],[object Object] |
| `editable` | `boolean` |  | `DateRangePickerProps` | true |
| `format` | `string` |  | `DateRangePickerProps` |  |
| `hideHours` | `(hour: number,  date: Date) =\> boolean` |  | `DateRangePickerProps` |  |
| `hideMinutes` | `(minute: number,  date: Date) =\> boolean` |  | `DateRangePickerProps` |  |
| `hideSeconds` | `(second: number,  date: Date) =\> boolean` |  | `DateRangePickerProps` |  |
| `hoverRange` | `'week' \| 'month' \| ((date: Date) =\> DateRange)` |  | `DateRangePickerProps` |  |
| `isoWeek` | `boolean` |  | `DateRangePickerProps` | ://en.wikipedia.org/wiki/ISO_week_date |
| `label` | `React.ReactNode` |  | `DateRangePickerProps` |  |
| `limitEndYear` | `number` |  | `DateRangePickerProps` | 1000 |
| `limitStartYear` | `number` |  | `DateRangePickerProps` |  |
| `loading` | `boolean` |  | `DateRangePickerProps` |  |
| `monthDropdownProps` | `MonthDropdownProps` |  | `DateRangePickerProps` |  |
| `onClean` | `(event: React.MouseEvent) =\> void` |  | `DateRangePickerProps` |  |
| `oneTap` | `boolean` |  | `DateRangePickerProps` |  |
| `onOk` | `(date: DateRange,  event: React.SyntheticEvent) =\> void` |  | `DateRangePickerProps` |  |
| `onSelect` | `(date: Date,  event?: React.SyntheticEvent) =\> void` |  | `DateRangePickerProps` |  |
| `onShortcutClick` | `(range: DateOptionPreset\<DateRange\>,  event: React.MouseEvent) =\> void` |  | `DateRangePickerProps` |  |
| `ranges` | `DateOptionPreset\<DateRange \| null\>[]` |  | `DateRangePickerProps` |  |
| `renderCell` | `(date: Date) =\> React.ReactNode` |  | `DateRangePickerProps` | 5.77.0 |
| `renderTitle` | `(date: Date,  calendarKey: 'start' \| 'end') =\> React.ReactNode` |  | `DateRangePickerProps` |  |
| `renderValue` | `(value: DateRange,  format: string) =\> string` |  | `DateRangePickerProps` |  |
| `shouldDisableDate` | `DisabledDateFunction` |  | `DateRangePickerProps` |  |
| `shouldDisableHour` | `(hour: number,  date: Date) =\> boolean` |  | `DateRangePickerProps` |  |
| `shouldDisableMinute` | `(minute: number,  date: Date) =\> boolean` |  | `DateRangePickerProps` |  |
| `shouldDisableSecond` | `(second: number,  date: Date) =\> boolean` |  | `DateRangePickerProps` |  |
| `showHeader` | `boolean` |  | `DateRangePickerProps` | true 5.52.0 |
| `showMeridian` | `boolean` |  | `DateRangePickerProps` | Use `showMeridiem` instead |
| `showMeridiem` | `boolean` |  | `DateRangePickerProps` |  |
| `showOneCalendar` | `boolean` |  | `DateRangePickerProps` |  |
| `showWeekNumbers` | `boolean` |  | `DateRangePickerProps` |  |
| `weekStart` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` |  | `DateRangePickerProps` | 0 |
| `align` | `WithResponsive\<CSS['alignItems']\>` |  | `PickerBaseProps` |  |
| `appearance` | `PickerAppearance` |  | `PickerBaseProps` |  |
| `as` | `As` |  | `PickerBaseProps` |  |
| `basis` | `WithResponsive\<CSS['flexBasis']\>` |  | `PickerBaseProps` |  |
| `bc` | `WithResponsive\<ColorScheme \| CSS['borderColor']\>` |  | `PickerBaseProps` |  |
| `bd` | `WithResponsive\<CSS['border']\>` |  | `PickerBaseProps` |  |
| `bdb` | `WithResponsive\<CSS['borderBottom']\>` |  | `PickerBaseProps` |  |
| `bdbc` | `WithResponsive\<ColorScheme \| CSS['borderBottomColor']\>` |  | `PickerBaseProps` |  |
| `bdbs` | `WithResponsive\<CSS['borderBottomStyle']\>` |  | `PickerBaseProps` |  |
| `bdbw` | `WithResponsive\<CSS['borderBottomWidth']\>` |  | `PickerBaseProps` |  |
| `bdl` | `WithResponsive\<CSS['borderLeft']\>` |  | `PickerBaseProps` |  |
| `bdlc` | `WithResponsive\<ColorScheme \| CSS['borderLeftColor']\>` |  | `PickerBaseProps` |  |
| `bdls` | `WithResponsive\<CSS['borderLeftStyle']\>` |  | `PickerBaseProps` |  |
| `bdlw` | `WithResponsive\<CSS['borderLeftWidth']\>` |  | `PickerBaseProps` |  |
| `bdr` | `WithResponsive\<CSS['borderRight']\>` |  | `PickerBaseProps` |  |
| `bdrc` | `WithResponsive\<ColorScheme \| CSS['borderRightColor']\>` |  | `PickerBaseProps` |  |
| `bdrs` | `WithResponsive\<CSS['borderRightStyle']\>` |  | `PickerBaseProps` |  |
| `bdrw` | `WithResponsive\<CSS['borderRightWidth']\>` |  | `PickerBaseProps` |  |
| `bdt` | `WithResponsive\<CSS['borderTop']\>` |  | `PickerBaseProps` |  |
| `bdtc` | `WithResponsive\<ColorScheme \| CSS['borderTopColor']\>` |  | `PickerBaseProps` |  |
| `bdts` | `WithResponsive\<CSS['borderTopStyle']\>` |  | `PickerBaseProps` |  |
| `bdtw` | `WithResponsive\<CSS['borderTopWidth']\>` |  | `PickerBaseProps` |  |
| `bg` | `WithResponsive\<ColorScheme \| CSS['background']\>` |  | `PickerBaseProps` |  |
| `bga` | `WithResponsive\<CSS['backgroundAttachment']\>` |  | `PickerBaseProps` |  |
| `bgc` | `WithResponsive\<ColorScheme \| CSS['backgroundColor']\>` |  | `PickerBaseProps` |  |
| `bgi` | `WithResponsive\<CSS['backgroundImage']\>` |  | `PickerBaseProps` |  |
| `bgp` | `WithResponsive\<CSS['backgroundPosition']\>` |  | `PickerBaseProps` |  |
| `bgr` | `WithResponsive\<CSS['backgroundRepeat']\>` |  | `PickerBaseProps` |  |
| `bgsz` | `WithResponsive\<CSS['backgroundSize']\>` |  | `PickerBaseProps` |  |
| `block` | `boolean` |  | `PickerBaseProps` |  |
| `bottom` | `WithResponsive\<CSS['bottom']\>` |  | `PickerBaseProps` |  |
| `bs` | `WithResponsive\<CSS['borderStyle']\>` |  | `PickerBaseProps` |  |
| `bsz` | `WithResponsive\<CSS['boxSizing']\>` |  | `PickerBaseProps` |  |
| `bw` | `WithResponsive\<CSS['borderWidth']\>` |  | `PickerBaseProps` |  |
| `c` | `WithResponsive\<ColorScheme \| CSS['color']\>` |  | `PickerBaseProps` |  |
| `children` | `ReactNode` |  | `PickerBaseProps` |  |
| `className` | `string` |  | `PickerBaseProps` |  |
| `classPrefix` | `string` |  | `PickerBaseProps` |  |
| `cleanable` | `boolean` |  | `PickerBaseProps` |  |
| `colgap` | `WithResponsive\<CSS['columnGap']\>` |  | `PickerBaseProps` |  |
| `container` | `HTMLElement \| (() =\> HTMLElement)` |  | `PickerBaseProps` |  |
| `containerPadding` | `number` |  | `PickerBaseProps` |  |
| `defaultOpen` | `boolean` |  | `PickerBaseProps` |  |
| `defaultValue` | `T` |  | `FormControlBaseProps` |  |
| `direction` | `WithResponsive\<CSS['flexDirection']\>` |  | `PickerBaseProps` |  |
| `disabled` | `boolean` |  | `PickerBaseProps` |  |
| `display` | `WithResponsive\<CSS['display']\>` |  | `PickerBaseProps` |  |
| `ff` | `WithResponsive\<CSS['fontFamily']\>` |  | `PickerBaseProps` |  |
| `flex` | `WithResponsive\<CSS['flex']\>` |  | `PickerBaseProps` |  |
| `fs` | `WithResponsive\<CSS['fontSize']\>` |  | `PickerBaseProps` |  |
| `fw` | `WithResponsive\<CSS['fontWeight']\>` |  | `PickerBaseProps` |  |
| `gap` | `WithResponsive\<CSS['gap']\>` |  | `PickerBaseProps` |  |
| `grow` | `WithResponsive\<CSS['flexGrow']\>` |  | `PickerBaseProps` |  |
| `h` | `WithResponsive\<CSS['height']\>` |  | `PickerBaseProps` |  |
| `hideFrom` | `Breakpoints` |  | `PickerBaseProps` |  |
| `id` | `string` |  | `PickerBaseProps` |  |
| `inset` | `WithResponsive\<CSS['inset']\>` |  | `PickerBaseProps` |  |
| `insetx` | `WithResponsive\<CSS['insetInline']\>` |  | `PickerBaseProps` |  |
| `insety` | `WithResponsive\<CSS['insetBlock']\>` |  | `PickerBaseProps` |  |
| `justify` | `WithResponsive\<CSS['justifyContent']\>` |  | `PickerBaseProps` |  |
| `left` | `WithResponsive\<CSS['left']\>` |  | `PickerBaseProps` |  |
| `lh` | `WithResponsive\<CSS['lineHeight']\>` |  | `PickerBaseProps` |  |
| `locale` | `Partial\<L\>` |  | `PickerBaseProps` |  |
| `lts` | `WithResponsive\<CSS['letterSpacing']\>` |  | `PickerBaseProps` |  |
| `m` | `WithResponsive\<CSS['margin']\>` |  | `PickerBaseProps` |  |
| `maxh` | `WithResponsive\<CSS['maxHeight']\>` |  | `PickerBaseProps` |  |
| `maxw` | `WithResponsive\<CSS['maxWidth']\>` |  | `PickerBaseProps` |  |
| `mb` | `WithResponsive\<CSS['marginBottom']\>` |  | `PickerBaseProps` |  |
| `me` | `WithResponsive\<CSS['marginInlineEnd']\>` |  | `PickerBaseProps` |  |
| `minh` | `WithResponsive\<CSS['minHeight']\>` |  | `PickerBaseProps` |  |
| `minw` | `WithResponsive\<CSS['minWidth']\>` |  | `PickerBaseProps` |  |
| `ml` | `WithResponsive\<CSS['marginLeft']\>` |  | `PickerBaseProps` |  |
| `mr` | `WithResponsive\<CSS['marginRight']\>` |  | `PickerBaseProps` |  |
| `ms` | `WithResponsive\<CSS['marginInlineStart']\>` |  | `PickerBaseProps` |  |
| `mt` | `WithResponsive\<CSS['marginTop']\>` |  | `PickerBaseProps` |  |
| `mx` | `WithResponsive\<CSS['marginInline']\>` |  | `PickerBaseProps` |  |
| `my` | `WithResponsive\<CSS['marginBlock']\>` |  | `PickerBaseProps` |  |
| `name` | `string` |  | `FormControlBaseProps` |  |
| `onBlur` | `FocusEventHandler\<any\>` |  | `PickerBaseProps` |  |
| `onChange` | `(value: T,  event: SyntheticEvent) =\> void` |  | `FormControlBaseProps` |  |
| `onClose` | `() =\> void` |  | `PickerBaseProps` |  |
| `onEnter` | `(node: HTMLElement) =\> void` |  | `PickerBaseProps` |  |
| `onEntered` | `(node: HTMLElement) =\> void` |  | `PickerBaseProps` |  |
| `onEntering` | `(node: HTMLElement) =\> void` |  | `PickerBaseProps` |  |
| `onExit` | `(node: HTMLElement) =\> void` |  | `PickerBaseProps` |  |
| `onExited` | `(node: HTMLElement) =\> void` |  | `PickerBaseProps` |  |
| `onExiting` | `(node: HTMLElement) =\> void` |  | `PickerBaseProps` |  |
| `onFocus` | `FocusEventHandler\<any\>` |  | `PickerBaseProps` |  |
| `onOpen` | `() =\> void` |  | `PickerBaseProps` |  |
| `opacity` | `WithResponsive\<CSS['opacity']\>` |  | `PickerBaseProps` |  |
| `open` | `boolean` |  | `PickerBaseProps` |  |
| `order` | `WithResponsive\<CSS['order']\>` |  | `PickerBaseProps` |  |
| `p` | `WithResponsive\<CSS['padding']\>` |  | `PickerBaseProps` |  |
| `pb` | `WithResponsive\<CSS['paddingBottom']\>` |  | `PickerBaseProps` |  |
| `pe` | `WithResponsive\<CSS['paddingInlineEnd']\>` |  | `PickerBaseProps` |  |
| `pl` | `WithResponsive\<CSS['paddingLeft']\>` |  | `PickerBaseProps` |  |
| `placeholder` | `ReactNode` |  | `PickerBaseProps` |  |
| `placement` | `Placement` |  | `PickerBaseProps` |  |
| `plaintext` | `boolean` |  | `FormControlBaseProps` |  |
| `popupAutoWidth` | `boolean` |  | `PickerBaseProps` |  |
| `popupClassName` | `string` |  | `PickerBaseProps` |  |
| `popupStyle` | `React.CSSProperties` |  | `PickerBaseProps` |  |
| `pos` | `WithResponsive\<CSS['position']\>` |  | `PickerBaseProps` |  |
| `pr` | `WithResponsive\<CSS['paddingRight']\>` |  | `PickerBaseProps` |  |
| `preventOverflow` | `boolean` |  | `PickerBaseProps` |  |
| `ps` | `WithResponsive\<CSS['paddingInlineStart']\>` |  | `PickerBaseProps` |  |
| `pt` | `WithResponsive\<CSS['paddingTop']\>` |  | `PickerBaseProps` |  |
| `px` | `WithResponsive\<CSS['paddingInline']\>` |  | `PickerBaseProps` |  |
| `py` | `WithResponsive\<CSS['paddingBlock']\>` |  | `PickerBaseProps` |  |
| `readOnly` | `boolean` |  | `FormControlBaseProps` |  |
| `ref` | `React.Ref\<PickerHandle \| undefined\>` |  | `PickerBaseProps` |  |
| `renderExtraFooter` | `() =\> ReactNode` |  | `PickerBaseProps` |  |
| `right` | `WithResponsive\<CSS['right']\>` |  | `PickerBaseProps` |  |
| `rounded` | `WithResponsive\<Size \| CSS['borderRadius'] \| 'full'\>` |  | `PickerBaseProps` |  |
| `rowgap` | `WithResponsive\<CSS['rowGap']\>` |  | `PickerBaseProps` |  |
| `self` | `WithResponsive\<CSS['alignSelf']\>` |  | `PickerBaseProps` |  |
| `shadow` | `WithResponsive\<Size \| CSS['boxShadow']\>` |  | `PickerBaseProps` |  |
| `showFrom` | `Breakpoints` |  | `PickerBaseProps` |  |
| `shrink` | `WithResponsive\<CSS['flexShrink']\>` |  | `PickerBaseProps` |  |
| `size` | `BasicSize` |  | `PickerBaseProps` |  |
| `spacing` | `WithResponsive\<CSS['gap']\>` |  | `PickerBaseProps` |  |
| `style` | `CSSProperties` |  | `PickerBaseProps` |  |
| `ta` | `WithResponsive\<CSS['textAlign']\>` |  | `PickerBaseProps` |  |
| `td` | `WithResponsive\<CSS['textDecoration']\>` |  | `PickerBaseProps` |  |
| `tdc` | `WithResponsive\<ColorScheme \| CSS['textDecorationColor']\>` |  | `PickerBaseProps` |  |
| `tds` | `WithResponsive\<CSS['textDecorationStyle']\>` |  | `PickerBaseProps` |  |
| `toggleAs` | `ElementType` |  | `PickerBaseProps` |  |
| `top` | `WithResponsive\<CSS['top']\>` |  | `PickerBaseProps` |  |
| `tt` | `WithResponsive\<CSS['textTransform']\>` |  | `PickerBaseProps` |  |
| `value` | `T` |  | `FormControlBaseProps` |  |
| `w` | `WithResponsive\<CSS['width']\>` |  | `PickerBaseProps` |  |
| `z` | `WithResponsive\<CSS['zIndex']\>` |  | `PickerBaseProps` |  |

---
*Auto-generated from rsuite type definitions. Refer to [rsuite documentation](https://rsuitejs.com/components/daterangepicker/#props) for full details.*
