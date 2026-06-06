# TreePicker

**Category:** Data Pickers
**Source:** `@/components/ui/RSuite/DataPickers/TreePicker`

## Props

| Prop | Type | Required | Inherited From | Description |
|------|------|----------|----------------|-------------|
| `onlyLeafSelectable` | `boolean` |  | `TreePickerProps` | false |
| `popupAutoWidth` | `boolean` |  | `TreePickerProps` | true |
| `renderValue` | `(value: V,  selectedNode: TreeNode,  selectedElement: React.ReactNode) =\> React.ReactNode` |  | `TreePickerProps` |  |
| `treeHeight` | `number` |  | `TreePickerProps` |  |
| `align` | `WithResponsive\<CSS['alignItems']\>` |  | `FormControlPickerProps` |  |
| `appearance` | `PickerAppearance` |  | `FormControlPickerProps` |  |
| `as` | `As` |  | `FormControlPickerProps` |  |
| `basis` | `WithResponsive\<CSS['flexBasis']\>` |  | `FormControlPickerProps` |  |
| `bc` | `WithResponsive\<ColorScheme \| CSS['borderColor']\>` |  | `FormControlPickerProps` |  |
| `bd` | `WithResponsive\<CSS['border']\>` |  | `FormControlPickerProps` |  |
| `bdb` | `WithResponsive\<CSS['borderBottom']\>` |  | `FormControlPickerProps` |  |
| `bdbc` | `WithResponsive\<ColorScheme \| CSS['borderBottomColor']\>` |  | `FormControlPickerProps` |  |
| `bdbs` | `WithResponsive\<CSS['borderBottomStyle']\>` |  | `FormControlPickerProps` |  |
| `bdbw` | `WithResponsive\<CSS['borderBottomWidth']\>` |  | `FormControlPickerProps` |  |
| `bdl` | `WithResponsive\<CSS['borderLeft']\>` |  | `FormControlPickerProps` |  |
| `bdlc` | `WithResponsive\<ColorScheme \| CSS['borderLeftColor']\>` |  | `FormControlPickerProps` |  |
| `bdls` | `WithResponsive\<CSS['borderLeftStyle']\>` |  | `FormControlPickerProps` |  |
| `bdlw` | `WithResponsive\<CSS['borderLeftWidth']\>` |  | `FormControlPickerProps` |  |
| `bdr` | `WithResponsive\<CSS['borderRight']\>` |  | `FormControlPickerProps` |  |
| `bdrc` | `WithResponsive\<ColorScheme \| CSS['borderRightColor']\>` |  | `FormControlPickerProps` |  |
| `bdrs` | `WithResponsive\<CSS['borderRightStyle']\>` |  | `FormControlPickerProps` |  |
| `bdrw` | `WithResponsive\<CSS['borderRightWidth']\>` |  | `FormControlPickerProps` |  |
| `bdt` | `WithResponsive\<CSS['borderTop']\>` |  | `FormControlPickerProps` |  |
| `bdtc` | `WithResponsive\<ColorScheme \| CSS['borderTopColor']\>` |  | `FormControlPickerProps` |  |
| `bdts` | `WithResponsive\<CSS['borderTopStyle']\>` |  | `FormControlPickerProps` |  |
| `bdtw` | `WithResponsive\<CSS['borderTopWidth']\>` |  | `FormControlPickerProps` |  |
| `bg` | `WithResponsive\<ColorScheme \| CSS['background']\>` |  | `FormControlPickerProps` |  |
| `bga` | `WithResponsive\<CSS['backgroundAttachment']\>` |  | `FormControlPickerProps` |  |
| `bgc` | `WithResponsive\<ColorScheme \| CSS['backgroundColor']\>` |  | `FormControlPickerProps` |  |
| `bgi` | `WithResponsive\<CSS['backgroundImage']\>` |  | `FormControlPickerProps` |  |
| `bgp` | `WithResponsive\<CSS['backgroundPosition']\>` |  | `FormControlPickerProps` |  |
| `bgr` | `WithResponsive\<CSS['backgroundRepeat']\>` |  | `FormControlPickerProps` |  |
| `bgsz` | `WithResponsive\<CSS['backgroundSize']\>` |  | `FormControlPickerProps` |  |
| `block` | `boolean` |  | `FormControlPickerProps` |  |
| `bottom` | `WithResponsive\<CSS['bottom']\>` |  | `FormControlPickerProps` |  |
| `bs` | `WithResponsive\<CSS['borderStyle']\>` |  | `FormControlPickerProps` |  |
| `bsz` | `WithResponsive\<CSS['boxSizing']\>` |  | `FormControlPickerProps` |  |
| `bw` | `WithResponsive\<CSS['borderWidth']\>` |  | `FormControlPickerProps` |  |
| `c` | `WithResponsive\<ColorScheme \| CSS['color']\>` |  | `FormControlPickerProps` |  |
| `caretAs` | `React.ElementType` |  | `PickerToggleProps` |  |
| `children` | `ReactNode` |  | `FormControlPickerProps` |  |
| `childrenKey` | `string` |  | `FormControlPickerProps` | children |
| `className` | `string` |  | `FormControlPickerProps` |  |
| `classPrefix` | `string` |  | `FormControlPickerProps` |  |
| `cleanable` | `boolean` |  | `FormControlPickerProps` |  |
| `colgap` | `WithResponsive\<CSS['columnGap']\>` |  | `FormControlPickerProps` |  |
| `container` | `HTMLElement \| (() =\> HTMLElement)` |  | `FormControlPickerProps` |  |
| `containerPadding` | `number` |  | `FormControlPickerProps` |  |
| `data` | `TData[]` | ✓ | `FormControlPickerProps` |  |
| `defaultExpandAll` | `boolean` |  | `TreeExtraProps` |  |
| `defaultExpandItemValues` | `any[]` |  | `TreeExtraProps` |  |
| `defaultOpen` | `boolean` |  | `FormControlPickerProps` |  |
| `defaultValue` | `T` |  | `FormControlPickerProps` |  |
| `direction` | `WithResponsive\<CSS['flexDirection']\>` |  | `FormControlPickerProps` |  |
| `disabled` | `boolean` |  | `FormControlPickerProps` |  |
| `disabledItemValues` | `ToArray\<NonNullable\<I\>\>` |  | `FormControlPickerProps` |  |
| `display` | `WithResponsive\<CSS['display']\>` |  | `FormControlPickerProps` |  |
| `ff` | `WithResponsive\<CSS['fontFamily']\>` |  | `FormControlPickerProps` |  |
| `flex` | `WithResponsive\<CSS['flex']\>` |  | `FormControlPickerProps` |  |
| `fs` | `WithResponsive\<CSS['fontSize']\>` |  | `FormControlPickerProps` |  |
| `fw` | `WithResponsive\<CSS['fontWeight']\>` |  | `FormControlPickerProps` |  |
| `gap` | `WithResponsive\<CSS['gap']\>` |  | `FormControlPickerProps` |  |
| `getChildren` | `(activeNode: T) =\> T[] \| Promise\<T[]\>` |  | `TreeExtraProps` | - The currently active node. The children of the active node. |
| `grow` | `WithResponsive\<CSS['flexGrow']\>` |  | `FormControlPickerProps` |  |
| `h` | `WithResponsive\<CSS['height']\>` |  | `FormControlPickerProps` |  |
| `height` | `number` |  | `TreeViewProps` |  |
| `hideFrom` | `Breakpoints` |  | `FormControlPickerProps` |  |
| `id` | `string` |  | `FormControlPickerProps` |  |
| `inset` | `WithResponsive\<CSS['inset']\>` |  | `FormControlPickerProps` |  |
| `insetx` | `WithResponsive\<CSS['insetInline']\>` |  | `FormControlPickerProps` |  |
| `insety` | `WithResponsive\<CSS['insetBlock']\>` |  | `FormControlPickerProps` |  |
| `justify` | `WithResponsive\<CSS['justifyContent']\>` |  | `FormControlPickerProps` |  |
| `labelKey` | `string` |  | `FormControlPickerProps` | label |
| `left` | `WithResponsive\<CSS['left']\>` |  | `FormControlPickerProps` |  |
| `lh` | `WithResponsive\<CSS['lineHeight']\>` |  | `FormControlPickerProps` |  |
| `loading` | `boolean` |  | `PickerToggleProps` |  |
| `locale` | `Partial\<L\>` |  | `FormControlPickerProps` |  |
| `lts` | `WithResponsive\<CSS['letterSpacing']\>` |  | `FormControlPickerProps` |  |
| `m` | `WithResponsive\<CSS['margin']\>` |  | `FormControlPickerProps` |  |
| `maxh` | `WithResponsive\<CSS['maxHeight']\>` |  | `FormControlPickerProps` |  |
| `maxw` | `WithResponsive\<CSS['maxWidth']\>` |  | `FormControlPickerProps` |  |
| `mb` | `WithResponsive\<CSS['marginBottom']\>` |  | `FormControlPickerProps` |  |
| `me` | `WithResponsive\<CSS['marginInlineEnd']\>` |  | `FormControlPickerProps` |  |
| `menuAutoWidth` | `boolean` |  | `DeprecatedMenuProps` | Use `popupAutoWidth` instead |
| `menuClassName` | `string` |  | `DeprecatedMenuProps` | Use `popupClassName` instead |
| `menuHeight` | `number` |  | `DeprecatedMenuProps` | Use columnHeight instead |
| `menuMaxHeight` | `number` |  | `DeprecatedMenuProps` | Use `listboxMaxHeight` instead |
| `menuStyle` | `CSSProperties` |  | `DeprecatedMenuProps` | Use `popupStyle` instead |
| `menuWidth` | `number` |  | `DeprecatedMenuProps` | Use columnWidth instead |
| `minh` | `WithResponsive\<CSS['minHeight']\>` |  | `FormControlPickerProps` |  |
| `minw` | `WithResponsive\<CSS['minWidth']\>` |  | `FormControlPickerProps` |  |
| `ml` | `WithResponsive\<CSS['marginLeft']\>` |  | `FormControlPickerProps` |  |
| `mr` | `WithResponsive\<CSS['marginRight']\>` |  | `FormControlPickerProps` |  |
| `ms` | `WithResponsive\<CSS['marginInlineStart']\>` |  | `FormControlPickerProps` |  |
| `mt` | `WithResponsive\<CSS['marginTop']\>` |  | `FormControlPickerProps` |  |
| `multiselectable` | `boolean` |  | `TreeViewProps` |  |
| `mx` | `WithResponsive\<CSS['marginInline']\>` |  | `FormControlPickerProps` |  |
| `my` | `WithResponsive\<CSS['marginBlock']\>` |  | `FormControlPickerProps` |  |
| `name` | `string` |  | `FormControlPickerProps` |  |
| `onBlur` | `FocusEventHandler\<any\>` |  | `FormControlPickerProps` |  |
| `onChange` | `(value: T,  event: SyntheticEvent) =\> void` |  | `FormControlPickerProps` |  |
| `onClose` | `() =\> void` |  | `FormControlPickerProps` |  |
| `onEnter` | `(node: HTMLElement) =\> void` |  | `FormControlPickerProps` |  |
| `onEntered` | `(node: HTMLElement) =\> void` |  | `FormControlPickerProps` |  |
| `onEntering` | `(node: HTMLElement) =\> void` |  | `FormControlPickerProps` |  |
| `onExit` | `(node: HTMLElement) =\> void` |  | `FormControlPickerProps` |  |
| `onExited` | `(node: HTMLElement) =\> void` |  | `FormControlPickerProps` |  |
| `onExiting` | `(node: HTMLElement) =\> void` |  | `FormControlPickerProps` |  |
| `onFocus` | `FocusEventHandler\<any\>` |  | `FormControlPickerProps` |  |
| `onOpen` | `() =\> void` |  | `FormControlPickerProps` |  |
| `opacity` | `WithResponsive\<CSS['opacity']\>` |  | `FormControlPickerProps` |  |
| `open` | `boolean` |  | `FormControlPickerProps` |  |
| `order` | `WithResponsive\<CSS['order']\>` |  | `FormControlPickerProps` |  |
| `p` | `WithResponsive\<CSS['padding']\>` |  | `FormControlPickerProps` |  |
| `pb` | `WithResponsive\<CSS['paddingBottom']\>` |  | `FormControlPickerProps` |  |
| `pe` | `WithResponsive\<CSS['paddingInlineEnd']\>` |  | `FormControlPickerProps` |  |
| `pl` | `WithResponsive\<CSS['paddingLeft']\>` |  | `FormControlPickerProps` |  |
| `placeholder` | `ReactNode` |  | `FormControlPickerProps` |  |
| `placement` | `Placement` |  | `FormControlPickerProps` |  |
| `plaintext` | `boolean` |  | `FormControlPickerProps` |  |
| `popupClassName` | `string` |  | `FormControlPickerProps` |  |
| `popupStyle` | `React.CSSProperties` |  | `FormControlPickerProps` |  |
| `pos` | `WithResponsive\<CSS['position']\>` |  | `FormControlPickerProps` |  |
| `pr` | `WithResponsive\<CSS['paddingRight']\>` |  | `FormControlPickerProps` |  |
| `preventOverflow` | `boolean` |  | `FormControlPickerProps` |  |
| `ps` | `WithResponsive\<CSS['paddingInlineStart']\>` |  | `FormControlPickerProps` |  |
| `pt` | `WithResponsive\<CSS['paddingTop']\>` |  | `FormControlPickerProps` |  |
| `px` | `WithResponsive\<CSS['paddingInline']\>` |  | `FormControlPickerProps` |  |
| `py` | `WithResponsive\<CSS['paddingBlock']\>` |  | `FormControlPickerProps` |  |
| `readOnly` | `boolean` |  | `FormControlPickerProps` |  |
| `ref` | `React.Ref\<PickerHandle \| undefined\>` |  | `FormControlPickerProps` |  |
| `renderExtraFooter` | `() =\> ReactNode` |  | `FormControlPickerProps` |  |
| `renderMenu` | `any` |  | `DeprecatedMenuProps` | For TreePicker and CheckTreePicker, use `renderTree` instead. For Cascader and MultiCascader, use `renderColumn` instead. |
| `renderMenuGroup` | `any` |  | `DeprecatedMenuProps` | Use renderOptionGroup instead |
| `renderMenuItem` | `any` |  | `DeprecatedMenuProps` | Use renderTreeNode or renderOption instead |
| `renderTree` | `(menu: React.ReactNode) =\> React.ReactNode` |  | `TreeExtraProps` | - The menu to be rendered. The rendered tree. |
| `renderTreeIcon` | `(nodeData: T,  expanded?: boolean) =\> React.ReactNode` |  | `TreeExtraProps` | - The data of the tree node. The rendered icon. |
| `renderTreeNode` | `(nodeData: T) =\> React.ReactNode` |  | `TreeExtraProps` | - The data of the tree node. The rendered node. |
| `right` | `WithResponsive\<CSS['right']\>` |  | `FormControlPickerProps` |  |
| `rounded` | `WithResponsive\<Size \| CSS['borderRadius'] \| 'full'\>` |  | `FormControlPickerProps` |  |
| `rowgap` | `WithResponsive\<CSS['rowGap']\>` |  | `FormControlPickerProps` |  |
| `self` | `WithResponsive\<CSS['alignSelf']\>` |  | `FormControlPickerProps` |  |
| `shadow` | `WithResponsive\<Size \| CSS['boxShadow']\>` |  | `FormControlPickerProps` |  |
| `showFrom` | `Breakpoints` |  | `FormControlPickerProps` |  |
| `shrink` | `WithResponsive\<CSS['flexShrink']\>` |  | `FormControlPickerProps` |  |
| `size` | `BasicSize` |  | `FormControlPickerProps` |  |
| `spacing` | `WithResponsive\<CSS['gap']\>` |  | `FormControlPickerProps` |  |
| `style` | `CSSProperties` |  | `FormControlPickerProps` |  |
| `ta` | `WithResponsive\<CSS['textAlign']\>` |  | `FormControlPickerProps` |  |
| `td` | `WithResponsive\<CSS['textDecoration']\>` |  | `FormControlPickerProps` |  |
| `tdc` | `WithResponsive\<ColorScheme \| CSS['textDecorationColor']\>` |  | `FormControlPickerProps` |  |
| `tds` | `WithResponsive\<CSS['textDecorationStyle']\>` |  | `FormControlPickerProps` |  |
| `toggleAs` | `ElementType` |  | `FormControlPickerProps` |  |
| `top` | `WithResponsive\<CSS['top']\>` |  | `FormControlPickerProps` |  |
| `treeRootClassName` | `string` | ✓ | `TreeViewProps` |  |
| `tt` | `WithResponsive\<CSS['textTransform']\>` |  | `FormControlPickerProps` |  |
| `value` | `T` |  | `FormControlPickerProps` |  |
| `valueKey` | `string` |  | `FormControlPickerProps` | value |
| `w` | `WithResponsive\<CSS['width']\>` |  | `FormControlPickerProps` |  |
| `z` | `WithResponsive\<CSS['zIndex']\>` |  | `FormControlPickerProps` |  |

---
*Auto-generated from rsuite type definitions. Refer to [rsuite documentation](https://rsuitejs.com/components/treepicker/#props) for full details.*
