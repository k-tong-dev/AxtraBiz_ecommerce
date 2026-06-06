# RSuite Component Props

Auto-generated from rsuite type definitions. For each component, only its **own unique props** are listed.
Props inherited from shared base interfaces (BoxProps, WithAsProps, etc.) are documented once below.

---

## Shared / Inherited Interfaces

These base interfaces are inherited by multiple components. Their props are documented here once.

### BaseModalProps

**Used by:** Modal

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `animationProps` | `any` |  |  |
| `autoFocus` | `boolean` |  |  |
| `backdrop` | `boolean \| 'static'` |  |  |
| `backdropClassName` | `string` |  |  |
| `backdropStyle` | `React.CSSProperties` |  |  |
| `backdropTransitionTimeout` | `number` |  |  |
| `children` | `any` |  |  |
| `container` | `HTMLElement \| (() =\> HTMLElement)` |  |  |
| `containerClassName` | `string` |  |  |
| `dialogTransitionTimeout` | `number` |  |  |
| `enforceFocus` | `boolean` |  |  |
| `keyboard` | `boolean` |  |  |
| `onBackdropClick` | `React.MouseEventHandler` |  |  |
| `onClick` | `React.MouseEventHandler` |  |  |
| `onClose` | `(event?: React.SyntheticEvent) =\> void` |  |  |
| `onEsc` | `React.KeyboardEventHandler` |  |  |
| `onMouseDown` | `React.MouseEventHandler` |  |  |
| `onOpen` | `() =\> void` |  |  |
| `open` | `boolean` |  |  |
| `transition` | `React.ElementType` |  |  |

### BoxProps

**Used by:** Button, ButtonGroup, Avatar, Badge, Calendar, Card, Stat, StatGroup, Tag, Checkbox, InlineEdit, NumberInput, PinInput, Radio, RadioGroup, RadioTile, SegmentedControl, Slider, Toggle, FormControl, FormControlLabel, FormErrorMessage, FormGroup, FormHelpText, FormStack, Center, Divider, Grid, Stack, Heading, Highlight, InputGroup, Kbd, Text, Affix, Menu, Navbar, Pagination, Sidenav, Steps, Popover, Tooltip, Loader, Message, Notification

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `hideFrom` | `Breakpoints` |  |  |
| `showFrom` | `Breakpoints` |  |  |

### ButtonProps

**Used by:** IconButton

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `active` | `boolean` |  |  |
| `appearance` | `AppearanceType` |  |  |
| `block` | `boolean` |  |  |
| `color` | `Color` |  |  |
| `disabled` | `boolean` |  |  |
| `endIcon` | `React.ReactNode` |  |  |
| `href` | `string` |  |  |
| `loading` | `boolean` |  |  |
| `onToggle` | `(active: boolean,  event: React.MouseEvent) =\> void` |  |  |
| `ripple` | `boolean` |  |  |
| `size` | `BasicSize` |  |  |
| `startIcon` | `React.ReactNode` |  |  |
| `target` | `string` |  |  |
| `toggleable` | `boolean` |  |  |
| `type` | `'button' \| 'reset' \| 'submit'` |  |  |

### CascadeTreeProps

**Used by:** Cascader

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `columnHeight` | `number` |  |  |
| `columnWidth` | `number` |  |  |
| `defaultValue` | `V` |  |  |
| `disabledItemValues` | `ToArray\<NonNullable\<T\>\>` |  |  |
| `getChildren` | `(childNodes: Option\<T\>) =\> Option\<T\>[] \| Promise\<Option\<T\>[]\>` |  |  |
| `locale` | `Partial\<L\>` |  |  |
| `onChange` | `(value: V,  event: React.SyntheticEvent) =\> void` |  |  |
| `onSearch` | `(value: string,  event: React.SyntheticEvent) =\> void` |  |  |
| `onSelect` | `(value: Option\<T\>,  selectedPaths: Option\<T\>[],  event: React.SyntheticEvent) =\> void` |  |  |
| `renderColumn` | `(childNodes: React.ReactNode,  column: CascadeColumn\<T\>) =\> React.ReactNode` |  |  |
| `renderSearchItem` | `(node: React.ReactNode,  items: Option\<T\>[]) =\> React.ReactNode` |  |  |
| `renderTreeNode` | `(node: React.ReactNode,  itemData: Option\<T\>) =\> React.ReactNode` |  |  |
| `searchable` | `boolean` |  |  |
| `value` | `V` |  |  |

### CheckTreeViewProps

**Used by:** CheckTree, CheckTreePicker

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `cascade` | `boolean` |  |  |
| `disabledItemValues` | `ToArray\<NonNullable\<V\>\>` |  |  |
| `listRef` | `React.RefObject\<any\>` |  |  |
| `onChange` | `(value: V,  event: React.SyntheticEvent) =\> void` |  |  |
| `onScroll` | `(event: React.SyntheticEvent) =\> void` |  |  |
| `searchable` | `boolean` |  |  |
| `searchInputRef` | `React.RefObject\<HTMLInputElement \| null\>` |  |  |
| `uncheckableItemValues` | `V` |  |  |
| `value` | `V` |  |  |

### DeprecatedDropdownProps

**Used by:** Dropdown

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `renderTitle` | `(children: React.ReactNode) =\> React.ReactNode` |  |  |

### DeprecatedMenuProps

**Used by:** CheckTreePicker, TreePicker

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `menuAutoWidth` | `boolean` |  | Use `popupAutoWidth` instead |
| `menuClassName` | `string` |  | Use `popupClassName` instead |
| `menuHeight` | `number` |  | Use columnHeight instead |
| `menuMaxHeight` | `number` |  | Use `listboxMaxHeight` instead |
| `menuStyle` | `CSSProperties` |  | Use `popupStyle` instead |
| `menuWidth` | `number` |  | Use columnWidth instead |
| `renderMenu` | `any` |  | For TreePicker and CheckTreePicker, use `renderTree` instead. For Cascader and MultiCascader, use `renderColumn` instead. |
| `renderMenuGroup` | `any` |  | Use renderOptionGroup instead |
| `renderMenuItem` | `any` |  | Use renderTreeNode or renderOption instead |

### DeprecatedProps

**Used by:** Cascader, MultiCascader, TagPicker, DatePicker

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `renderMenuItemCheckbox` | `(checkboxProps: CheckboxProps) =\> React.ReactNode` |  | Use `renderCheckbox` instead |

### FormControlBaseProps

**Used by:** NumberInput, RadioGroup, Rate, SegmentedControl, Slider, DateInput, DatePicker, DateRangeInput, DateRangePicker, TimePicker, TimeRangePicker

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `defaultValue` | `T` |  |  |
| `disabled` | `boolean` |  |  |
| `name` | `string` |  |  |
| `onChange` | `(value: T,  event: SyntheticEvent) =\> void` |  |  |
| `plaintext` | `boolean` |  |  |
| `readOnly` | `boolean` |  |  |
| `value` | `T` |  |  |

### FormControlPickerProps

**Used by:** AutoComplete, Cascader, CheckPicker, CheckTreePicker, InputPicker, MultiCascader, SelectPicker, TreePicker

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `disabledItemValues` | `ToArray\<NonNullable\<I\>\>` |  |  |

### InputBaseCommonProps

**Used by:** Input, Textarea

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` |  |  |
| `inputRef` | `React.Ref\<any\>` |  |  |
| `placeholder` | `string` |  |  |
| `plaintext` | `boolean` |  |  |
| `size` | `Size` |  |  |

### InputPickerProps

**Used by:** TagPicker

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `cacheData` | `InputOption\<V\>[]` |  |  |
| `creatable` | `boolean` |  |  |
| `onBlur` | `React.FocusEventHandler` |  |  |
| `onCreate` | `(value: V,  item: Option,  event: React.SyntheticEvent) =\> void` |  |  |
| `onFocus` | `React.FocusEventHandler` |  |  |
| `renderValue` | `(value: V,  item: Option\<V\>,  selectedElement: React.ReactNode) =\> React.ReactNode` |  |  |
| `shouldDisplayCreateOption` | `(searchKeyword: string,  filteredData: InputOption\<V\>[]) =\> boolean` |  | Value of the textbox The items filtered by the searchKeyword |
| `tabIndex` | `number` |  |  |

### InputProps

**Used by:** PasswordInput, DateInput, DateRangeInput

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `triggerRef` | `React.RefObject\<OverlayTriggerHandle \| null\>` | ✓ |  |
| `multi` | `boolean` |  |  |

### ListboxProps

**Used by:** AutoComplete

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `listboxMaxHeight` | `number` |  |  |
| `renderListbox` | `(menu: React.ReactNode) =\> React.ReactNode` |  |  |
| `renderOption` | `(label: React.ReactNode,  item: Option) =\> React.ReactNode` |  |  |
| `renderOptionGroup` | `(title: React.ReactNode,  item: Option) =\> React.ReactNode` |  |  |

### ModalProps

**Used by:** Drawer

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `animation` | `React.ElementType` |  |  |
| `animationTimeout` | `number` |  |  |
| `bodyFill` | `boolean` |  |  |
| `centered` | `boolean` |  |  |
| `closeButton` | `React.ReactNode \| boolean` |  |  |
| `dialogAs` | `React.ElementType` |  |  |
| `dialogClassName` | `string` |  |  |
| `dialogStyle` | `React.CSSProperties` |  |  |
| `full` | `boolean` |  | Use size="full" instead. |
| `isDrawer` | `boolean` |  |  |
| `overflow` | `boolean` |  |  |
| `size` | `ModalSize` |  |  |

### MultiCascadeTreeProps

**Used by:** MultiCascader

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `cascade` | `boolean` |  |  |
| `disabledItemValues` | `ToArray\<NonNullable\<T\>\>` |  |  |
| `locale` | `Partial\<L\>` |  |  |
| `onCheck` | `(value: T[],  node: Option\<T\>,  checked: boolean,  event: React.SyntheticEvent) =\> void` |  |  |
| `uncheckableItemValues` | `T[]` |  |  |

### PickerBaseProps

**Used by:** DatePicker, DateRangePicker, TimePicker, TimeRangePicker

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `appearance` | `PickerAppearance` |  |  |
| `block` | `boolean` |  |  |
| `cleanable` | `boolean` |  |  |
| `container` | `HTMLElement \| (() =\> HTMLElement)` |  |  |
| `containerPadding` | `number` |  |  |
| `defaultOpen` | `boolean` |  |  |
| `disabled` | `boolean` |  |  |
| `id` | `string` |  |  |
| `locale` | `Partial\<L\>` |  |  |
| `onBlur` | `FocusEventHandler\<any\>` |  |  |
| `onClose` | `() =\> void` |  |  |
| `onFocus` | `FocusEventHandler\<any\>` |  |  |
| `onOpen` | `() =\> void` |  |  |
| `open` | `boolean` |  |  |
| `placeholder` | `ReactNode` |  |  |
| `placement` | `Placement` |  |  |
| `preventOverflow` | `boolean` |  |  |
| `ref` | `React.Ref\<PickerHandle \| undefined\>` |  |  |
| `renderExtraFooter` | `() =\> ReactNode` |  |  |
| `size` | `BasicSize` |  |  |
| `toggleAs` | `ElementType` |  |  |

### PickerToggleProps

**Used by:** Cascader, CheckPicker, CheckTreePicker, InputPicker, MultiCascader, SelectPicker, TreePicker

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `active` | `boolean` |  |  |
| `caret` | `boolean` |  |  |
| `caretAs` | `React.ElementType` |  |  |
| `caretComponent` | `React.FC\<IconProps\>` |  | Use `caretAs` instead |
| `cleanable` | `boolean` |  |  |
| `countable` | `boolean` |  |  |
| `disabled` | `boolean` |  |  |
| `focusItemValue` | `T \| null` |  |  |
| `hasValue` | `boolean` |  |  |
| `inputValue` | `T \| T[]` |  |  |
| `label` | `React.ReactNode` |  |  |
| `loading` | `boolean` |  |  |
| `name` | `string` |  |  |
| `onClean` | `(event: React.MouseEvent) =\> void` |  |  |
| `placement` | `Placement` |  |  |
| `plaintext` | `boolean` |  |  |
| `readOnly` | `boolean` |  |  |
| `tabIndex` | `number` |  |  |

### SafeAnchorProps

**Used by:** Link

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `disabled` | `boolean` |  |  |
| `href` | `string` |  |  |

### SelectProps

**Used by:** CheckPicker, InputPicker, SelectPicker

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `groupBy` | `string` |  |  |
| `listProps` | `Partial\<ListProps\>` |  |  |
| `onClean` | `(event: React.SyntheticEvent) =\> void` |  |  |
| `onGroupTitleClick` | `(event: React.SyntheticEvent) =\> void` |  |  |
| `onSearch` | `(searchKeyword: string,  event?: React.SyntheticEvent) =\> void` |  |  |
| `onSelect` | `(value: any,  item: Option\<T\>,  event: React.SyntheticEvent) =\> void` |  |  |
| `renderValue` | `(value: T,  item: Option\<T\>,  selectedElement: React.ReactNode) =\> React.ReactNode` |  |  |
| `searchable` | `boolean` |  |  |
| `searchBy` | `(keyword: string,  label: React.ReactNode,  item: Option) =\> boolean` |  |  |
| `sort` | `(isGroup: boolean) =\> (a: any,  b: any) =\> number` |  |  |
| `virtualized` | `boolean` |  |  |

### StackProps

**Used by:** ButtonToolbar

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `direction` | `WithResponsive\<CSSProperties['flexDirection']\>` |  |  |
| `divider` | `React.ReactNode` |  |  |
| `wrap` | `boolean` |  |  |

### StyledBoxProps

**Used by:** Rate, Breadcrumb

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string` | ✓ |  |
| `color` | `Color \| React.CSSProperties['color']` |  |  |
| `size` | `Size \| number \| string` |  |  |

### TreeExtraProps

**Used by:** CheckTree, Tree, CheckTreePicker, TreePicker

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `defaultExpandAll` | `boolean` |  |  |
| `defaultExpandItemValues` | `any[]` |  |  |
| `getChildren` | `(activeNode: T) =\> T[] \| Promise\<T[]\>` |  | - The currently active node. The children of the active node. |
| `renderTree` | `(menu: React.ReactNode) =\> React.ReactNode` |  | - The menu to be rendered. The rendered tree. |
| `renderTreeIcon` | `(nodeData: T,  expanded?: boolean) =\> React.ReactNode` |  | - The data of the tree node. The rendered icon. |
| `renderTreeNode` | `(nodeData: T) =\> React.ReactNode` |  | - The data of the tree node. The rendered node. |

### TreeViewProps

**Used by:** TreePicker

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `treeRootClassName` | `string` | ✓ |  |
| `height` | `number` |  |  |
| `multiselectable` | `boolean` |  |  |

### UploadTriggerProps

**Used by:** Uploader

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `accept` | `string` |  |  |
| `children` | `React.ReactElement\<any\>` |  |  |
| `className` | `string` |  |  |
| `disabled` | `boolean` |  |  |
| `draggable` | `boolean` |  |  |
| `locale` | `UploaderLocale` |  |  |
| `multiple` | `boolean` |  |  |
| `name` | `string` |  |  |
| `onChange` | `React.ChangeEventHandler\<HTMLInputElement\>` |  |  |
| `onDragEnter` | `React.DragEventHandler\<HTMLInputElement\>` |  |  |
| `onDragLeave` | `React.DragEventHandler\<HTMLInputElement\>` |  |  |
| `onDragOver` | `React.DragEventHandler\<HTMLInputElement\>` |  |  |
| `onDrop` | `React.DragEventHandler\<HTMLInputElement\>` |  |  |
| `readOnly` | `boolean` |  |  |

### WithAsProps

**Used by:** Form, Dropdown

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `as` | `As` |  |  |

### WithTreeDragProps

**Used by:** Tree

No direct props.


---

## Components (own props only)

Only the unique props for each component. Shared props are documented above.

### Buttons

**Button**  
`@/components/ui/RSuite/Button`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `active` | `boolean` |  |  |
| `appearance` | `AppearanceType` |  |  |
| `block` | `boolean` |  |  |
| `color` | `Color` |  |  |
| `disabled` | `boolean` |  |  |
| `endIcon` | `React.ReactNode` |  |  |
| `href` | `string` |  |  |
| `loading` | `boolean` |  |  |
| `onToggle` | `(active: boolean,  event: React.MouseEvent) =\> void` |  |  |
| `ripple` | `boolean` |  |  |
| `size` | `BasicSize` |  |  |
| `startIcon` | `React.ReactNode` |  |  |
| `target` | `string` |  |  |
| `toggleable` | `boolean` |  |  |
| `type` | `'button' \| 'reset' \| 'submit'` |  |  |

**ButtonGroup**  
`@/components/ui/RSuite/ButtonGroup`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `block` | `boolean` |  |  |
| `disabled` | `boolean` |  |  |
| `divided` | `boolean` |  |  |
| `justified` | `boolean` |  |  |
| `role` | `string` |  |  |
| `size` | `BasicSize` |  |  |
| `vertical` | `boolean` |  |  |

**ButtonToolbar**  
`@/components/ui/RSuite/ButtonToolbar`  
Inherits: StackProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `role` | `string` |  |  |

**IconButton**  
`@/components/ui/RSuite/IconButton`  
Inherits: ButtonProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `circle` | `boolean` |  |  |
| `icon` | `React.ReactElement\<IconProps\>` |  |  |
| `placement` | `'left' \| 'right' \| 'start' \| 'end'` |  |  |

### Data Display

**Avatar**  
`@/components/ui/RSuite/Avatar`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `alt` | `string` |  |  |
| `bordered` | `boolean` |  | 5.59.0 |
| `circle` | `boolean` |  |  |
| `color` | `ColorScheme \| CSSProperties['color']` |  | 5.59.0 |
| `imgProps` | `React.ImgHTMLAttributes\<HTMLImageElement\>` |  |  |
| `onError` | `OnErrorEventHandler` |  | 5.59.0 |
| `size` | `StyledBoxProps['size']` |  |  |
| `sizes` | `string` |  |  |
| `src` | `string` |  |  |
| `srcSet` | `string` |  |  |

**Badge**  
`@/components/ui/RSuite/Badge`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `color` | `Color \| React.CSSProperties['color']` |  |  |
| `compact` | `boolean` |  |  |
| `content` | `React.ReactNode` |  |  |
| `invisible` | `boolean` |  | 6.0.0 |
| `maxCount` | `number` |  |  |
| `offset` | `[number \| string,  number \| string]` |  | 6.0.0 |
| `outline` | `boolean` |  | 6.0.0 |
| `placement` | `PlacementCorners` |  | 6.0.0 |
| `shape` | `'rectangle' \| 'circle'` |  | 6.0.0 |
| `size` | `Size` |  |  |

**Calendar**  
`@/components/ui/RSuite/Calendar`  
Inherits: BoxProps  

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

**Card**  
`@/components/ui/RSuite/Card`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `bordered` | `boolean` |  |  |
| `direction` | `'row' \| 'column'` |  |  |
| `shaded` | `boolean \| 'hover'` |  |  |
| `size` | `'lg' \| 'md' \| 'sm'` |  |  |
| `width` | `number \| string` |  |  |

**Stat**  
`@/components/ui/RSuite/Stat`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `bordered` | `boolean` |  |  |
| `icon` | `React.ReactNode` |  |  |

**StatGroup**  
`@/components/ui/RSuite/StatGroup`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `columns` | `number` |  |  |
| `spacing` | `number \| string` |  |  |

**Tag**  
`@/components/ui/RSuite/Tag`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `React.ReactNode` |  |  |
| `closable` | `boolean` |  |  |
| `color` | `Color \| React.CSSProperties['color']` |  |  |
| `locale` | `CommonLocale` |  |  |
| `onClose` | `(event: React.MouseEvent\<HTMLElement\>) =\> void` |  |  |
| `size` | `'lg' \| 'md' \| 'sm'` |  |  |

### Data Entry

**AutoComplete**  
`@/components/ui/RSuite/AutoComplete`  
Inherits: FormControlPickerProps, ListboxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `autoComplete` | `string` |  |  |
| `filterBy` | `(value: string,  item: Option) =\> boolean` |  |  |
| `onBlur` | `React.FocusEventHandler` |  |  |
| `onClose` | `() =\> void` |  |  |
| `onFocus` | `React.FocusEventHandler` |  |  |
| `onKeyDown` | `(event: React.KeyboardEvent) =\> void` |  |  |
| `onMenuFocus` | `(focusItemValue: any,  event: React.KeyboardEvent) =\> void` |  |  |
| `onOpen` | `() =\> void` |  |  |
| `onSelect` | `(value: any,  item: Option,  event: React.SyntheticEvent) =\> void` |  |  |
| `open` | `boolean` |  |  |
| `placeholder` | `string` |  |  |
| `placement` | `Placement` |  |  |
| `selectOnEnter` | `boolean` |  |  |
| `size` | `BasicSize` |  |  |

**Checkbox**  
`@/components/ui/RSuite/Checkbox`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `checkable` | `boolean` |  | Used in MultiCascader |
| `checked` | `boolean` |  |  |
| `color` | `Color` |  | 5.56.0 |
| `defaultChecked` | `boolean` |  |  |
| `disabled` | `boolean` |  |  |
| `indeterminate` | `boolean` |  |  |
| `inline` | `boolean` |  | Used in CheckboxGroup |
| `inputProps` | `React.HTMLAttributes\<HTMLInputElement\>` |  |  |
| `inputRef` | `React.Ref\<any\>` |  |  |
| `labelClickable` | `boolean` |  | Used in MultiCascader |
| `name` | `string` |  |  |
| `onChange` | `(value: V \| undefined,  checked: boolean,  event: React.ChangeEvent\<HTMLInputElement\>) =\> void` |  |  |
| `onCheckboxClick` | `(event: React.SyntheticEvent) =\> void` |  | Used in MultiCascader |
| `onClick` | `(event: React.SyntheticEvent) =\> void` |  |  |
| `plaintext` | `boolean` |  |  |
| `readOnly` | `boolean` |  |  |
| `value` | `V` |  |  |

**CheckTree**  
`@/components/ui/RSuite/CheckTree`  
Inherits: CheckTreeViewProps, TreeExtraProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `defaultValue` | `T` |  |  |
| `scrollShadow` | `boolean` |  |  |

**InlineEdit**  
`@/components/ui/RSuite/InlineEdit`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `((props: ChildrenProps,  ref: React.Ref\<any\>) =\> React.ReactElement) \| React.ReactElement` |  |  |
| `defaultValue` | `any` |  |  |
| `disabled` | `boolean` |  |  |
| `onCancel` | `(event?: React.SyntheticEvent) =\> void` |  |  |
| `onChange` | `(value: any,  event: React.ChangeEvent) =\> void` |  |  |
| `onEdit` | `(event: React.SyntheticEvent) =\> void` |  |  |
| `onSave` | `(event?: React.SyntheticEvent) =\> void` |  |  |
| `placeholder` | `string` |  |  |
| `showControls` | `boolean` |  | true |
| `size` | `'lg' \| 'md' \| 'sm' \| 'xs'` |  |  |
| `stateOnBlur` | `'save' \| 'cancel'` |  |  |
| `value` | `any` |  |  |

**Input**  
`@/components/ui/RSuite/Input`  
Inherits: InputBaseCommonProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `htmlSize` | `number` |  | https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/size 5.49.0 |
| `onChange` | `PrependParameters\<React.ChangeEventHandler\<HTMLInputElement\>,  [value: string]\>` |  |  |
| `onPressEnter` | `React.KeyboardEventHandler\<HTMLInputElement\>` |  |  |
| `type` | `string` |  |  |

**NumberInput**  
`@/components/ui/RSuite/NumberInput`  
Inherits: BoxProps, FormControlBaseProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `buttonAppearance` | `AppearanceType` |  |  |
| `controls` | `boolean \| ((trigger: 'up' \| 'down') =\> React.ReactNode)` |  |  |
| `decimalSeparator` | `string` |  | '.' 5.69.0 |
| `disabled` | `boolean` |  |  |
| `formatter` | `(value: number \| string) =\> string` |  |  |
| `max` | `number` |  |  |
| `min` | `number` |  |  |
| `onWheel` | `(event: React.WheelEvent) =\> void` |  |  |
| `postfix` | `React.ReactNode` |  | Use `suffix` instead. |
| `prefix` | `React.ReactNode` |  |  |
| `scrollable` | `boolean` |  |  |
| `size` | `BasicSize` |  |  |
| `step` | `number` |  |  |
| `suffix` | `React.ReactNode` |  |  |

**PasswordInput**  
`@/components/ui/RSuite/PasswordInput`  
Inherits: InputProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `defaultVisible` | `boolean` |  |  |
| `endIcon` | `React.ReactNode` |  |  |
| `onVisibleChange` | `(visible: boolean) =\> void` |  |  |
| `renderVisibilityIcon` | `(visible: boolean) =\> React.ReactNode` |  |  |
| `startIcon` | `React.ReactNode` |  |  |
| `visible` | `boolean` |  |  |

**PinInput**  
`@/components/ui/RSuite/PinInput`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `attached` | `boolean` |  |  |
| `autoFocus` | `boolean` |  |  |
| `defaultValue` | `string` |  |  |
| `disabled` | `boolean` |  |  |
| `length` | `number` |  |  |
| `mask` | `boolean` |  |  |
| `name` | `string` |  |  |
| `onChange` | `(value: string) =\> void` |  |  |
| `onComplete` | `(value: string) =\> void` |  |  |
| `otp` | `boolean` |  |  |
| `placeholder` | `string` |  |  |
| `readOnly` | `boolean` |  |  |
| `size` | `BasicSize` |  |  |
| `type` | `'number' \| 'alphabetic' \| 'alphanumeric' \| RegExp` |  |  |
| `value` | `string` |  |  |

**Radio**  
`@/components/ui/RSuite/Radio`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `checked` | `boolean` |  |  |
| `color` | `Color` |  | 5.56.0 |
| `defaultChecked` | `boolean` |  |  |
| `disabled` | `boolean` |  |  |
| `inline` | `boolean` |  | Used in RadioGroup |
| `inputProps` | `React.HTMLAttributes\<HTMLInputElement\>` |  |  |
| `inputRef` | `React.Ref\<HTMLInputElement\>` |  |  |
| `name` | `string` |  |  |
| `onChange` | `(value: T \| undefined,  checked: boolean,  event: React.ChangeEvent\<HTMLInputElement\>) =\> void` |  |  |
| `plaintext` | `boolean` |  |  |
| `readOnly` | `boolean` |  |  |
| `value` | `T` |  |  |

**RadioGroup**  
`@/components/ui/RSuite/RadioGroup`  
Inherits: BoxProps, FormControlBaseProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `appearance` | `'default' \| 'picker'` |  | Use `<SegmentedControl indicator="underline" />` instead |
| `children` | `React.ReactNode` |  |  |
| `inline` | `boolean` |  |  |
| `name` | `string` |  |  |

**RadioTile**  
`@/components/ui/RSuite/RadioTile`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `checked` | `boolean` |  |  |
| `children` | `React.ReactNode` |  |  |
| `defaultChecked` | `boolean` |  |  |
| `disabled` | `boolean` |  |  |
| `icon` | `React.ReactNode` |  |  |
| `label` | `React.ReactNode` |  |  |
| `name` | `string` |  |  |
| `onChange` | `(value?: T,  event?: React.ChangeEvent\<HTMLInputElement\>) =\> void` |  |  |
| `value` | `T` |  |  |

**Rate**  
`@/components/ui/RSuite/Rate`  
Inherits: FormControlBaseProps, StyledBoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `allowHalf` | `boolean` |  |  |
| `as` | `React.ElementType` |  |  |
| `character` | `React.ReactNode` |  |  |
| `classPrefix` | `string` |  |  |
| `cleanable` | `boolean` |  |  |
| `color` | `Color \| React.CSSProperties['color']` |  |  |
| `max` | `number` |  |  |
| `name` | `string` |  | Internal use only - extracted from props to prevent conflicts with StyledBox |
| `onChangeActive` | `(value: T,  event: React.SyntheticEvent) =\> void` |  |  |
| `renderCharacter` | `(value: number,  index: number) =\> React.ReactNode` |  |  |
| `size` | `Size` |  |  |
| `vertical` | `boolean` |  |  |

**SegmentedControl**  
`@/components/ui/RSuite/SegmentedControl`  
Inherits: BoxProps, FormControlBaseProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `block` | `boolean` |  |  |
| `data` | `SegmentedItemDataType[]` |  |  |
| `indicator` | `'pill' \| 'underline'` |  |  |
| `name` | `string` |  |  |
| `size` | `Size` |  |  |

**Slider**  
`@/components/ui/RSuite/Slider`  
Inherits: BoxProps, FormControlBaseProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `'aria-label'` | `string` |  |  |
| `'aria-labelledby'` | `string` |  |  |
| `'aria-valuetext'` | `string` |  |  |
| `barClassName` | `string` |  |  |
| `getAriaValueText` | `(value: number,  eventKey?: 'start' \| 'end') =\> string` |  |  |
| `graduated` | `boolean` |  |  |
| `handleClassName` | `string` |  |  |
| `handleStyle` | `React.CSSProperties` |  |  |
| `handleTitle` | `React.ReactNode` |  |  |
| `keepTooltipOpen` | `boolean` |  |  |
| `marks` | `{ value: number; label: React.ReactNode; }[]` |  | 6.0.0 |
| `max` | `number` |  |  |
| `min` | `number` |  |  |
| `onChangeCommitted` | `(value: T,  event: React.MouseEvent) =\> void` |  |  |
| `placeholder` | `React.ReactNode` |  |  |
| `progress` | `boolean` |  |  |
| `renderMark` | `(mark: number) =\> React.ReactNode` |  |  |
| `renderTooltip` | `(value: number \| undefined) =\> React.ReactNode` |  |  |
| `size` | `Size` |  | 'sm' 6.0.0 |
| `step` | `number` |  |  |
| `tooltip` | `boolean` |  |  |
| `vertical` | `boolean` |  |  |

**Textarea**  
`@/components/ui/RSuite/Textarea`  
Inherits: InputBaseCommonProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `autosize` | `boolean` |  |  |
| `maxRows` | `number` |  |  |
| `minRows` | `number` |  |  |
| `onChange` | `PrependParameters\<React.ChangeEventHandler\<HTMLTextAreaElement\>,  [value: string]\>` |  |  |
| `onPressEnter` | `React.KeyboardEventHandler\<HTMLTextAreaElement\>` |  |  |
| `resize` | `React.CSSProperties['resize']` |  |  |
| `size` | `Size` |  | 'md' |

**Toggle**  
`@/components/ui/RSuite/Toggle`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `checked` | `boolean` |  |  |
| `checkedChildren` | `React.ReactNode` |  |  |
| `color` | `Color` |  |  |
| `defaultChecked` | `boolean` |  |  |
| `disabled` | `boolean` |  |  |
| `label` | `React.ReactNode` |  |  |
| `labelPlacement` | `'start' \| 'end'` |  | 6.0.0 |
| `loading` | `boolean` |  |  |
| `locale` | `ToggleLocale` |  |  |
| `onChange` | `(checked: boolean,  event: React.ChangeEvent\<HTMLInputElement\>) =\> void` |  |  |
| `plaintext` | `boolean` |  |  |
| `readOnly` | `boolean` |  |  |
| `size` | `Size` |  |  |
| `unCheckedChildren` | `React.ReactNode` |  |  |

**Tree**  
`@/components/ui/RSuite/Tree`  
Inherits: TreeExtraProps, WithTreeDragProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `defaultValue` | `T` |  |  |
| `onChange` | `(value: T,  event: React.SyntheticEvent) =\> void` |  | - The new value. - The event object. |
| `scrollShadow` | `boolean` |  |  |

**Uploader**  
`@/components/ui/RSuite/Uploader`  
Inherits: UploadTriggerProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `action` | `string` | ✓ |  |
| `accept` | `string` |  |  |
| `autoUpload` | `boolean` |  |  |
| `children` | `React.ReactElement` |  |  |
| `data` | `any` |  |  |
| `defaultFileList` | `FileType[]` |  |  |
| `disabled` | `boolean` |  |  |
| `disabledFileItem` | `boolean` |  |  |
| `disableMultipart` | `boolean` |  |  |
| `draggable` | `boolean` |  |  |
| `fileList` | `FileType[]` |  |  |
| `fileListVisible` | `boolean` |  |  |
| `headers` | `any` |  |  |
| `listType` | `'text' \| 'picture-text' \| 'picture'` |  |  |
| `locale` | `UploaderLocale` |  |  |
| `maxPreviewFileSize` | `number` |  |  |
| `method` | `string` |  |  |
| `multiple` | `boolean` |  |  |
| `name` | `string` |  |  |
| `onChange` | `(fileList: FileType[],  event: React.ChangeEvent \| React.MouseEvent) =\> void` |  |  |
| `onError` | `(status: ErrorStatus,  file: FileType,  event: ProgressEvent,  xhr: XMLHttpRequest) =\> void` |  |  |
| `onPreview` | `(file: FileType,  event: React.SyntheticEvent) =\> void` |  |  |
| `onProgress` | `(percent: number,  file: FileType,  event: ProgressEvent,  xhr: XMLHttpRequest) =\> void` |  |  |
| `onRemove` | `(file: FileType) =\> void` |  |  |
| `onReupload` | `(file: FileType) =\> void` |  |  |
| `onSuccess` | `(response: any,  file: FileType,  event: ProgressEvent,  xhr: XMLHttpRequest) =\> void` |  |  |
| `onUpload` | `(file: FileType,  uploadData: any,  xhr: XMLHttpRequest) =\> void` |  |  |
| `plaintext` | `boolean` |  |  |
| `readOnly` | `boolean` |  |  |
| `ref` | `React.Ref\<UploaderInstance \| undefined\>` |  |  |
| `removable` | `boolean` |  |  |
| `renderFileInfo` | `(file: FileType,  fileElement: React.ReactNode) =\> React.ReactNode` |  |  |
| `renderThumbnail` | `(file: FileType,  thumbnail: React.ReactNode) =\> React.ReactNode` |  |  |
| `shouldQueueUpdate` | `(fileList: FileType[],  newFile: FileType[] \| FileType) =\> boolean \| Promise\<boolean\>` |  |  |
| `shouldUpload` | `(file: FileType) =\> boolean \| Promise\<boolean\>` |  |  |
| `timeout` | `number` |  |  |
| `toggleAs` | `React.ElementType` |  |  |
| `withCredentials` | `boolean` |  |  |

### Data Pickers

**Cascader**  
`@/components/ui/RSuite/Cascader`  
Inherits: CascadeTreeProps, DeprecatedProps, FormControlPickerProps, PickerToggleProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onClean` | `(event: React.SyntheticEvent) =\> void` |  |  |
| `parentSelectable` | `boolean` |  |  |
| `renderValue` | `(value: T,  selectedPaths: Option\<T\>[],  selectedElement: React.ReactNode) =\> React.ReactNode` |  |  |

**CheckPicker**  
`@/components/ui/RSuite/CheckPicker`  
Inherits: FormControlPickerProps, PickerToggleProps, SelectProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `countable` | `boolean` |  |  |
| `renderValue` | `(value: T[],  item: Option\<T\>[],  selectedElement: React.ReactNode) =\> React.ReactNode` |  |  |
| `sticky` | `boolean` |  |  |

**CheckTreePicker**  
`@/components/ui/RSuite/CheckTreePicker`  
Inherits: CheckTreeViewProps, DeprecatedMenuProps, FormControlPickerProps, PickerToggleProps, TreeExtraProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `countable` | `boolean` |  |  |
| `onCascadeChange` | `(v: ValueType,  event: React.SyntheticEvent) =\> void` |  |  |
| `popupAutoWidth` | `boolean` |  | true |
| `renderValue` | `(value: V,  selectedNodes: TreeNode[],  selectedElement: React.ReactNode) =\> React.ReactNode` |  |  |
| `treeHeight` | `number` |  |  |

**InputPicker**  
`@/components/ui/RSuite/InputPicker`  
Inherits: FormControlPickerProps, PickerToggleProps, SelectProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `cacheData` | `InputOption\<V\>[]` |  |  |
| `creatable` | `boolean` |  |  |
| `onBlur` | `React.FocusEventHandler` |  |  |
| `onCreate` | `(value: V,  item: Option,  event: React.SyntheticEvent) =\> void` |  |  |
| `onFocus` | `React.FocusEventHandler` |  |  |
| `renderValue` | `(value: V,  item: Option\<V\>,  selectedElement: React.ReactNode) =\> React.ReactNode` |  |  |
| `shouldDisplayCreateOption` | `(searchKeyword: string,  filteredData: InputOption\<V\>[]) =\> boolean` |  | Value of the textbox The items filtered by the searchKeyword |
| `tabIndex` | `number` |  |  |

**MultiCascader**  
`@/components/ui/RSuite/MultiCascader`  
Inherits: DeprecatedProps, FormControlPickerProps, MultiCascadeTreeProps, PickerToggleProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `countable` | `boolean` |  |  |
| `onClean` | `(event: React.SyntheticEvent) =\> void` |  |  |
| `renderValue` | `(value: T[],  selectedItems: Option\<T\>[],  selectedElement: React.ReactNode) =\> React.ReactNode` |  |  |

**SelectPicker**  
`@/components/ui/RSuite/SelectPicker`  
Inherits: FormControlPickerProps, PickerToggleProps, SelectProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `defaultValue` | `T` |  |  |
| `onChange` | `(value: T \| null,  event: React.SyntheticEvent) =\> void` |  |  |
| `value` | `T \| null` |  |  |

**TagPicker**  
`@/components/ui/RSuite/TagPicker`  
Inherits: DeprecatedProps, InputPickerProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `renderCheckbox` | `(checkboxProps: CheckboxProps) =\> React.ReactNode` |  |  |
| `renderValue` | `(values: V[],  items: Option\<V\>[],  selectedElement: React.ReactNode) =\> React.ReactNode` |  |  |

**TreePicker**  
`@/components/ui/RSuite/TreePicker`  
Inherits: DeprecatedMenuProps, FormControlPickerProps, PickerToggleProps, TreeExtraProps, TreeViewProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onlyLeafSelectable` | `boolean` |  | false |
| `popupAutoWidth` | `boolean` |  | true |
| `renderValue` | `(value: V,  selectedNode: TreeNode,  selectedElement: React.ReactNode) =\> React.ReactNode` |  |  |
| `treeHeight` | `number` |  |  |

### Date and Time

**DateInput**  
`@/components/ui/RSuite/DateInput`  
Inherits: FormControlBaseProps, InputProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `format` | `string` |  | ://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table 'yyyy-MM-dd' |
| `placeholder` | `string` |  |  |

**DatePicker**  
`@/components/ui/RSuite/DatePicker`  
Inherits: DeprecatedProps, FormControlBaseProps, PickerBaseProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `calendarDefaultDate` | `Date` |  |  |
| `caretAs` | `React.ElementType \| null` |  |  |
| `disabled` | `boolean` |  |  |
| `editable` | `boolean` |  |  |
| `format` | `string` |  |  |
| `hideHours` | `(hour: number,  date: Date) =\> boolean` |  |  |
| `hideMinutes` | `(minute: number,  date: Date) =\> boolean` |  |  |
| `hideSeconds` | `(second: number,  date: Date) =\> boolean` |  |  |
| `isoWeek` | `boolean` |  | ://en.wikipedia.org/wiki/ISO_week_date |
| `label` | `React.ReactNode` |  |  |
| `limitEndYear` | `number` |  |  |
| `limitStartYear` | `number` |  |  |
| `loading` | `boolean` |  |  |
| `monthDropdownProps` | `MonthDropdownProps` |  |  |
| `onChangeCalendarDate` | `(date: Date,  event?: React.SyntheticEvent) =\> void` |  |  |
| `onClean` | `(event: React.MouseEvent) =\> void` |  |  |
| `oneTap` | `boolean` |  |  |
| `onNextMonth` | `(date: Date) =\> void` |  |  |
| `onOk` | `(date: Date,  event: React.SyntheticEvent) =\> void` |  |  |
| `onPrevMonth` | `(date: Date) =\> void` |  |  |
| `onSelect` | `(date: Date,  event?: React.SyntheticEvent) =\> void` |  |  |
| `onShortcutClick` | `(range: DateOptionPreset\<Date\>,  event: React.MouseEvent) =\> void` |  |  |
| `onToggleMonthDropdown` | `(toggle: boolean) =\> void` |  |  |
| `onToggleTimeDropdown` | `(toggle: boolean) =\> void` |  |  |
| `plaintext` | `boolean` |  |  |
| `ranges` | `DateOptionPreset\<Date \| null\>[]` |  |  |
| `readOnly` | `boolean` |  |  |
| `renderCell` | `(date: Date) =\> React.ReactNode` |  | 5.54.0 |
| `renderValue` | `(value: Date,  format: string) =\> string` |  |  |
| `shouldDisableDate` | `(date: Date) =\> boolean` |  | date should be disabled (not selectable) |
| `shouldDisableHour` | `(hour: number,  date: Date) =\> boolean` |  |  |
| `shouldDisableMinute` | `(minute: number,  date: Date) =\> boolean` |  |  |
| `shouldDisableSecond` | `(second: number,  date: Date) =\> boolean` |  |  |
| `showMeridian` | `boolean` |  | Use `showMeridiem` instead |
| `showMeridiem` | `boolean` |  |  |
| `showWeekNumbers` | `boolean` |  |  |
| `weekStart` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` |  | 0 |

**DateRangeInput**  
`@/components/ui/RSuite/DateRangeInput`  
Inherits: FormControlBaseProps, InputProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `character` | `string` |  | ' ~ ' |
| `format` | `string` |  | ://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table 'yyyy-MM-dd' |
| `placeholder` | `string` |  |  |

**DateRangePicker**  
`@/components/ui/RSuite/DateRangePicker`  
Inherits: FormControlBaseProps, PickerBaseProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `calendarSnapping` | `boolean` |  | false 5.69.0 |
| `caretAs` | `React.ElementType \| null` |  |  |
| `character` | `string` |  | ' ~ ' |
| `defaultCalendarValue` | `DateRange` |  |  |
| `disabledDate` | `DisabledDateFunction` |  | [object Object],[object Object],[object Object] |
| `editable` | `boolean` |  | true |
| `format` | `string` |  |  |
| `hideHours` | `(hour: number,  date: Date) =\> boolean` |  |  |
| `hideMinutes` | `(minute: number,  date: Date) =\> boolean` |  |  |
| `hideSeconds` | `(second: number,  date: Date) =\> boolean` |  |  |
| `hoverRange` | `'week' \| 'month' \| ((date: Date) =\> DateRange)` |  |  |
| `isoWeek` | `boolean` |  | ://en.wikipedia.org/wiki/ISO_week_date |
| `label` | `React.ReactNode` |  |  |
| `limitEndYear` | `number` |  | 1000 |
| `limitStartYear` | `number` |  |  |
| `loading` | `boolean` |  |  |
| `monthDropdownProps` | `MonthDropdownProps` |  |  |
| `onClean` | `(event: React.MouseEvent) =\> void` |  |  |
| `oneTap` | `boolean` |  |  |
| `onOk` | `(date: DateRange,  event: React.SyntheticEvent) =\> void` |  |  |
| `onSelect` | `(date: Date,  event?: React.SyntheticEvent) =\> void` |  |  |
| `onShortcutClick` | `(range: DateOptionPreset\<DateRange\>,  event: React.MouseEvent) =\> void` |  |  |
| `ranges` | `DateOptionPreset\<DateRange \| null\>[]` |  |  |
| `renderCell` | `(date: Date) =\> React.ReactNode` |  | 5.77.0 |
| `renderTitle` | `(date: Date,  calendarKey: 'start' \| 'end') =\> React.ReactNode` |  |  |
| `renderValue` | `(value: DateRange,  format: string) =\> string` |  |  |
| `shouldDisableDate` | `DisabledDateFunction` |  |  |
| `shouldDisableHour` | `(hour: number,  date: Date) =\> boolean` |  |  |
| `shouldDisableMinute` | `(minute: number,  date: Date) =\> boolean` |  |  |
| `shouldDisableSecond` | `(second: number,  date: Date) =\> boolean` |  |  |
| `showHeader` | `boolean` |  | true 5.52.0 |
| `showMeridian` | `boolean` |  | Use `showMeridiem` instead |
| `showMeridiem` | `boolean` |  |  |
| `showOneCalendar` | `boolean` |  |  |
| `showWeekNumbers` | `boolean` |  |  |
| `weekStart` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` |  | 0 |

**TimePicker**  
`@/components/ui/RSuite/TimePicker`  
Inherits: FormControlBaseProps, PickerBaseProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `calendarDefaultDate` | `Date` |  |  |
| `caretAs` | `React.ElementType \| null` |  |  |
| `disabled` | `boolean` |  |  |
| `editable` | `boolean` |  |  |
| `format` | `string` |  |  |
| `hideHours` | `(hour: number,  date: Date) =\> boolean` |  |  |
| `hideMinutes` | `(minute: number,  date: Date) =\> boolean` |  |  |
| `hideSeconds` | `(second: number,  date: Date) =\> boolean` |  |  |
| `label` | `React.ReactNode` |  |  |
| `loading` | `boolean` |  |  |
| `onClean` | `(event: React.MouseEvent) =\> void` |  |  |
| `onOk` | `(date: Date,  event: React.SyntheticEvent) =\> void` |  |  |
| `onSelect` | `(date: Date,  event?: React.SyntheticEvent) =\> void` |  |  |
| `onShortcutClick` | `(range: DateOptionPreset\<Date\>,  event: React.MouseEvent) =\> void` |  |  |
| `plaintext` | `boolean` |  |  |
| `readOnly` | `boolean` |  |  |
| `renderValue` | `(value: Date,  format: string) =\> string` |  |  |
| `showMeridiem` | `boolean` |  |  |

**TimeRangePicker**  
`@/components/ui/RSuite/TimeRangePicker`  
Inherits: FormControlBaseProps, PickerBaseProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `caretAs` | `React.ElementType \| null` |  |  |
| `character` | `string` |  | ' ~ ' |
| `editable` | `boolean` |  | true |
| `format` | `string` |  |  |
| `hideHours` | `(hour: number,  date: Date) =\> boolean` |  |  |
| `hideMinutes` | `(minute: number,  date: Date) =\> boolean` |  |  |
| `hideSeconds` | `(second: number,  date: Date) =\> boolean` |  |  |
| `label` | `React.ReactNode` |  |  |
| `loading` | `boolean` |  |  |
| `onClean` | `(event: React.MouseEvent) =\> void` |  |  |
| `onOk` | `(date: DateRange,  event: React.SyntheticEvent) =\> void` |  |  |
| `onShortcutClick` | `(range: DateOptionPreset\<DateRange\>,  event: React.MouseEvent) =\> void` |  |  |
| `ranges` | `DateOptionPreset\<DateRange \| null\>[]` |  |  |
| `renderTitle` | `(date: Date) =\> React.ReactNode` |  |  |
| `renderValue` | `(value: DateRange,  format: string) =\> string` |  |  |
| `showHeader` | `boolean` |  |  |
| `showMeridiem` | `boolean` |  |  |

### Form

**Form**  
`@/components/ui/RSuite/Form`  
Inherits: WithAsProps  

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
| `onChange` | `(formValue: V,  event?: React.SyntheticEvent) =\> void` |  |  |
| `onCheck` | `(formError: E) =\> void` |  |  |
| `onError` | `(formError: E) =\> void` |  |  |
| `onReset` | `(formValue: V \| null,  event?: React.FormEvent\<HTMLFormElement\>) =\> void` |  |  |
| `onSubmit` | `(formValue: V \| null,  event?: React.FormEvent\<HTMLFormElement\>) =\> void` |  |  |
| `plaintext` | `boolean` |  |  |
| `readOnly` | `boolean` |  |  |

**FormControl**  
`@/components/ui/RSuite/FormControl`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string` | ✓ | ```js <Form formValue={{ address: { city: 'Shanghai' } }}>   <FormControl name="address.city" /> </Form> ``` |
| `accepter` | `React.ElementType` |  |  |
| `checkAsync` | `boolean` |  |  |
| `checkTrigger` | `CheckTriggerType` |  |  |
| `disabled` | `boolean` |  |  |
| `errorMessage` | `React.ReactNode` |  |  |
| `errorPlacement` | `ErrorMessagePlacement` |  |  |
| `onChange` | `void` |  |  |
| `plaintext` | `boolean` |  |  |
| `readOnly` | `boolean` |  |  |
| `rule` | `CheckType\<unknown,  any\>` |  |  |
| `shouldResetWithUnmount` | `boolean` |  |  |
| `value` | `ValueType` |  |  |

**FormControlLabel**  
`@/components/ui/RSuite/FormControlLabel`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `htmlFor` | `string` |  |  |

**FormErrorMessage**  
`@/components/ui/RSuite/FormErrorMessage`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `placement` | `ErrorMessagePlacement` |  |  |
| `show` | `boolean` |  |  |

**FormGroup**  
`@/components/ui/RSuite/FormGroup`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `controlId` | `string` |  |  |

**FormHelpText**  
`@/components/ui/RSuite/FormHelpText`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `tooltip` | `boolean` |  |  |

**FormStack**  
`@/components/ui/RSuite/FormStack`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `fluid` | `boolean` |  |  |
| `layout` | `'horizontal' \| 'vertical' \| 'inline'` |  |  |

### Layout

**Center**  
`@/components/ui/RSuite/Center`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `inline` | `boolean` |  |  |

**Divider**  
`@/components/ui/RSuite/Divider`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `appearance` | `'solid' \| 'dashed' \| 'dotted'` |  |  |
| `color` | `Color \| React.CSSProperties['color']` |  |  |
| `label` | `React.ReactNode` |  |  |
| `labelPlacement` | `'start' \| 'center' \| 'end'` |  | 6.0.0 |
| `size` | `Size \| number \| string` |  |  |
| `spacing` | `Size \| number \| string` |  |  |
| `vertical` | `boolean` |  |  |

**Grid**  
`@/components/ui/RSuite/Grid`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `fluid` | `boolean` |  |  |

**Stack**  
`@/components/ui/RSuite/Stack`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `direction` | `WithResponsive\<CSSProperties['flexDirection']\>` |  |  |
| `divider` | `React.ReactNode` |  |  |
| `wrap` | `boolean` |  |  |

### Miscellaneous

**Heading**  
`@/components/ui/RSuite/Heading`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` |  | 3 |

**Highlight**  
`@/components/ui/RSuite/Highlight`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `query` | `string \| string[]` |  |  |
| `renderMark` | `(match: string,  index: number) =\> React.ReactNode` |  |  |

**InputGroup**  
`@/components/ui/RSuite/InputGroup`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `React.ReactNode` |  |  |
| `disabled` | `boolean` |  |  |
| `inside` | `boolean` |  |  |
| `size` | `Size` |  |  |

**Kbd**  
`@/components/ui/RSuite/Kbd`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `size` | `Size` |  |  |

**Text**  
`@/components/ui/RSuite/Text`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `align` | `'left' \| 'center' \| 'right' \| 'justify'` |  |  |
| `color` | `BoxProps['c']` |  |  |
| `maxLines` | `number` |  |  |
| `muted` | `boolean` |  |  |
| `size` | `TextSize \| number \| string` |  |  |
| `transform` | `'uppercase' \| 'lowercase' \| 'capitalize'` |  |  |
| `weight` | `'thin' \| 'light' \| 'regular' \| 'medium' \| 'semibold' \| 'bold' \| 'extrabold'` |  | 'regular' |

### Navigation

**Affix**  
`@/components/ui/RSuite/Affix`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `container` | `HTMLElement \| (() =\> HTMLElement)` |  |  |
| `onChange` | `(fixed?: boolean) =\> void` |  |  |
| `onOffsetChange` | `(offset?: Offset) =\> void` |  |  |
| `top` | `number` |  |  |

**Breadcrumb**  
`@/components/ui/RSuite/Breadcrumb`  
Inherits: StyledBoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `ellipsis` | `React.ReactNode` |  |  |
| `locale` | `BreadcrumbLocale` |  |  |
| `maxItems` | `number` |  |  |
| `onExpand` | `(event: React.MouseEvent) =\> void` |  |  |
| `separator` | `React.ReactNode` |  |  |
| `size` | `'sm' \| 'md' \| 'lg' \| number \| string` |  |  |

**Dropdown**  
`@/components/ui/RSuite/Dropdown`  
Inherits: DeprecatedDropdownProps, WithAsProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `activeKey` | `T` |  |  |
| `defaultOpen` | `boolean` |  |  |
| `disabled` | `boolean` |  |  |
| `eventKey` | `T` |  |  |
| `icon` | `React.ReactElement\<IconProps\>` |  |  |
| `menuStyle` | `React.CSSProperties` |  |  |
| `noCaret` | `boolean` |  |  |
| `onClose` | `() =\> void` |  |  |
| `onOpen` | `() =\> void` |  |  |
| `onSelect` | `(eventKey: T \| undefined,  event: React.SyntheticEvent) =\> void` |  |  |
| `onToggle` | `(open?: boolean) =\> void` |  |  |
| `open` | `boolean` |  |  |
| `placement` | `PlacementCorners` |  |  |
| `renderToggle` | `(props: WithAsProps,  ref: React.Ref\<any\>) =\> any` |  |  |
| `title` | `React.ReactNode` |  |  |
| `toggleAs` | `React.ElementType` |  |  |
| `toggleClassName` | `string` |  |  |
| `trigger` | `DropdownTrigger \| DropdownTrigger[]` |  |  |

**Link**  
`@/components/ui/RSuite/Link`  
Inherits: SafeAnchorProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `anchorIcon` | `React.ReactNode` |  |  |
| `external` | `boolean` |  |  |
| `showAnchorIcon` | `boolean` |  |  |
| `underline` | `'always' \| 'hover' \| 'not-hover' \| 'never'` |  |  |

**Menu**  
`@/components/ui/RSuite/Menu`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `activeKey` | `T` |  |  |
| `onSelect` | `(eventKey: T \| undefined,  event: React.SyntheticEvent) =\> void` |  |  |

**Nav**  
`@/components/ui/RSuite/Nav`  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `activeKey` | `T` |  |  |
| `appearance` | `'default' \| 'subtle' \| 'tabs'` |  | 'default' |
| `defaultActiveKey` | `T` |  |  |
| `justified` | `boolean` |  |  |
| `onSelect` | `(eventKey: T \| undefined,  event: React.SyntheticEvent) =\> void` |  |  |
| `pullRight` | `boolean` |  | Use `Navbar.Content` instead. |
| `reversed` | `boolean` |  |  |
| `vertical` | `boolean` |  |  |

**Navbar**  
`@/components/ui/RSuite/Navbar`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `appearance` | `'default' \| 'inverse' \| 'subtle'` |  |  |
| `drawerOpen` | `boolean` |  |  |
| `onDrawerOpenChange` | `(open: boolean) =\> void` |  |  |

**Pagination**  
`@/components/ui/RSuite/Pagination`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `activePage` | `number` |  |  |
| `boundaryLinks` | `boolean` |  |  |
| `disabled` | `boolean \| ((eventKey: number \| string) =\> boolean)` |  |  |
| `ellipsis` | `boolean \| React.ReactNode` |  |  |
| `first` | `boolean \| React.ReactNode` |  |  |
| `last` | `boolean \| React.ReactNode` |  |  |
| `linkAs` | `React.ElementType` |  |  |
| `linkProps` | `Record\<string,  any\>` |  |  |
| `locale` | `PaginationLocale` |  |  |
| `maxButtons` | `number` |  |  |
| `next` | `boolean \| React.ReactNode` |  |  |
| `onSelect` | `(eventKey: string \| number,  event: React.MouseEvent) =\> void` |  |  |
| `pages` | `number` |  |  |
| `prev` | `boolean \| React.ReactNode` |  |  |
| `size` | `BasicSize` |  |  |

**Sidenav**  
`@/components/ui/RSuite/Sidenav`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `activeKey` | `T` |  | Use <Nav activeKey> instead |
| `appearance` | `'default' \| 'inverse' \| 'subtle'` |  |  |
| `defaultOpenKeys` | `T[]` |  |  |
| `expanded` | `boolean` |  |  |
| `onOpenChange` | `(openKeys: T[],  event: React.SyntheticEvent) =\> void` |  |  |
| `onSelect` | `(eventKey: T \| undefined,  event: React.SyntheticEvent) =\> void` |  | Use <Nav onSelect> instead |
| `openKeys` | `T[]` |  |  |

**Steps**  
`@/components/ui/RSuite/Steps`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `React.ReactNode` |  |  |
| `current` | `number` |  |  |
| `currentStatus` | `'finish' \| 'wait' \| 'process' \| 'error'` |  |  |
| `small` | `boolean` |  |  |
| `vertical` | `boolean` |  |  |

### Overlays

**Drawer**  
`@/components/ui/RSuite/Drawer`  
Inherits: ModalProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `closeButton` | `React.ReactNode \| boolean` |  |  |
| `placement` | `PlacementCardinal` |  |  |

**Modal**  
`@/components/ui/RSuite/Modal`  
Inherits: BaseModalProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `animation` | `React.ElementType` |  |  |
| `animationTimeout` | `number` |  |  |
| `bodyFill` | `boolean` |  |  |
| `centered` | `boolean` |  |  |
| `closeButton` | `React.ReactNode \| boolean` |  |  |
| `dialogAs` | `React.ElementType` |  |  |
| `dialogClassName` | `string` |  |  |
| `dialogStyle` | `React.CSSProperties` |  |  |
| `full` | `boolean` |  | Use size="full" instead. |
| `isDrawer` | `boolean` |  |  |
| `overflow` | `boolean` |  |  |
| `size` | `ModalSize` |  |  |

**Popover**  
`@/components/ui/RSuite/Popover`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `arrow` | `boolean` |  |  |
| `full` | `boolean` |  |  |
| `title` | `React.ReactNode` |  |  |
| `visible` | `boolean` |  |  |

**Tooltip**  
`@/components/ui/RSuite/Tooltip`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `arrow` | `boolean` |  |  |
| `children` | `React.ReactNode` |  |  |
| `placement` | `Placement` |  |  |
| `visible` | `boolean` |  |  |

### Status

**Loader**  
`@/components/ui/RSuite/Loader`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `backdrop` | `boolean` |  |  |
| `center` | `boolean` |  |  |
| `content` | `React.ReactNode` |  |  |
| `inverse` | `boolean` |  |  |
| `size` | `Size` |  |  |
| `speed` | `'normal' \| 'fast' \| 'slow' \| 'paused'` |  |  |
| `vertical` | `boolean` |  |  |

**Message**  
`@/components/ui/RSuite/Message`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `bordered` | `boolean` |  | 5.53.0 |
| `centered` | `boolean` |  | 5.53.0 |
| `closable` | `boolean` |  |  |
| `duration` | `number` |  | 2000 Use `toaster.push(<Message />, { duration: 2000 })` instead. |
| `full` | `boolean` |  |  |
| `header` | `React.ReactNode` |  |  |
| `onClose` | `(event?: React.MouseEvent\<HTMLButtonElement\>) =\> void` |  |  |
| `showIcon` | `boolean` |  |  |
| `type` | `StatusType` |  |  |

**Notification**  
`@/components/ui/RSuite/Notification`  
Inherits: BoxProps  

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `React.ReactNode \| (() =\> React.ReactNode)` |  |  |
| `closable` | `boolean` |  |  |
| `duration` | `number` |  | 4500 Use `toaster.push(<Notification />, { duration: 4500 })` instead.  |
| `header` | `React.ReactNode` |  |  |
| `onClose` | `(event?: React.MouseEvent\<HTMLButtonElement\>) =\> void` |  |  |
| `type` | `StatusType` |  |  |

---
*Auto-generated by `scripts/gen-rsuite-docs.js`. Refer to [rsuite documentation](https://rsuitejs.com/components) for full details.*
