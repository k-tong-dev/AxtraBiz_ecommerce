# CheckTree

**Category:** Data Entry
**Source:** `@/components/ui/RSuite/DataEntry/CheckTree`

## Props

| Prop | Type | Required | Inherited From | Description |
|------|------|----------|----------------|-------------|
| `defaultValue` | `T` |  | `CheckTreeProps` |  |
| `scrollShadow` | `boolean` |  | `CheckTreeProps` |  |
| `cascade` | `boolean` |  | `CheckTreeViewProps` |  |
| `childrenKey` | `string` |  | `CheckTreeViewProps` | children |
| `data` | `TData[]` | ✓ | `CheckTreeViewProps` |  |
| `defaultExpandAll` | `boolean` |  | `TreeExtraProps` |  |
| `defaultExpandItemValues` | `any[]` |  | `TreeExtraProps` |  |
| `disabledItemValues` | `ToArray\<NonNullable\<V\>\>` |  | `CheckTreeViewProps` |  |
| `expandItemValues` | `any[]` |  | `CheckTreeViewProps` |  |
| `getChildren` | `(activeNode: T) =\> T[] \| Promise\<T[]\>` |  | `TreeExtraProps` | - The currently active node. The children of the active node. |
| `height` | `number` |  | `CheckTreeViewProps` |  |
| `labelKey` | `string` |  | `CheckTreeViewProps` | label |
| `listProps` | `Partial\<ListProps\>` |  | `CheckTreeViewProps` |  |
| `listRef` | `React.RefObject\<any\>` |  | `CheckTreeViewProps` |  |
| `onChange` | `(value: V,  event: React.SyntheticEvent) =\> void` |  | `CheckTreeViewProps` |  |
| `onClean` | `(event: React.SyntheticEvent) =\> void` |  | `CheckTreeViewProps` | - The event object. |
| `onExpand` | `(expandItemValues: T[],  activeNode: T,  concat: (data: T[],  children: T[]) =\> T[]) =\> void` |  | `CheckTreeViewProps` | - The values of the expanded nodes. - The currently active node. - A function to concatenate data and children. |
| `onScroll` | `(event: React.SyntheticEvent) =\> void` |  | `CheckTreeViewProps` |  |
| `onSearch` | `(searchKeyword: string,  event: React.SyntheticEvent) =\> void` |  | `CheckTreeViewProps` | - The search keyword. - The event object. |
| `onSelect` | `(activeNode: T,  value: V,  event: React.SyntheticEvent) =\> void` |  | `CheckTreeViewProps` | - The currently active node. - The value of the selected node. - The event object. |
| `onSelectItem` | `(item: T,  path: T[]) =\> void` |  | `CheckTreeViewProps` | - The clicked tree item. - The path of the clicked item. |
| `renderTree` | `(menu: React.ReactNode) =\> React.ReactNode` |  | `TreeExtraProps` | - The menu to be rendered. The rendered tree. |
| `renderTreeIcon` | `(nodeData: T,  expanded?: boolean) =\> React.ReactNode` |  | `TreeExtraProps` | - The data of the tree node. The rendered icon. |
| `renderTreeNode` | `(nodeData: T) =\> React.ReactNode` |  | `TreeExtraProps` | - The data of the tree node. The rendered node. |
| `searchable` | `boolean` |  | `CheckTreeViewProps` |  |
| `searchBy` | `(keyword: string,  label: React.ReactNode,  item: any) =\> boolean` |  | `CheckTreeViewProps` | - The search keyword. - The label of the tree item. - The tree item. Whether the item matches the search criteria. |
| `searchInputRef` | `React.RefObject\<HTMLInputElement \| null\>` |  | `CheckTreeViewProps` |  |
| `searchKeyword` | `string` |  | `CheckTreeViewProps` |  |
| `showIndentLine` | `boolean` |  | `CheckTreeViewProps` |  |
| `uncheckableItemValues` | `V` |  | `CheckTreeViewProps` |  |
| `value` | `V` |  | `CheckTreeViewProps` |  |
| `valueKey` | `string` |  | `CheckTreeViewProps` | value |
| `virtualized` | `boolean` |  | `CheckTreeViewProps` |  |

---
*Auto-generated from rsuite type definitions. Refer to [rsuite documentation](https://rsuitejs.com/components/checktree/#props) for full details.*
