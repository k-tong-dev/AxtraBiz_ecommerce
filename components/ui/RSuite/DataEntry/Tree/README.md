# Tree

**Category:** Data Entry
**Source:** `@/components/ui/RSuite/DataEntry/Tree`

## Props

| Prop | Type | Required | Inherited From | Description |
|------|------|----------|----------------|-------------|
| `defaultValue` | `T` |  | `TreeProps` |  |
| `onChange` | `(value: T,  event: React.SyntheticEvent) =\> void` |  | `TreeProps` | - The new value. - The event object. |
| `scrollShadow` | `boolean` |  | `TreeProps` |  |
| `defaultExpandAll` | `boolean` |  | `TreeExtraProps` |  |
| `defaultExpandItemValues` | `any[]` |  | `TreeExtraProps` |  |
| `draggable` | `boolean` |  | `WithTreeDragProps` |  |
| `getChildren` | `(activeNode: T) =\> T[] \| Promise\<T[]\>` |  | `TreeExtraProps` | - The currently active node. The children of the active node. |
| `onDragEnd` | `(nodeData: T,  e: React.DragEvent) =\> void` |  | `WithTreeDragProps` | - The data associated with the dragged node. - The drag event. |
| `onDragEnter` | `(nodeData: T,  e: React.DragEvent) =\> void` |  | `WithTreeDragProps` | - The data associated with the dragged node. - The drag event. |
| `onDragLeave` | `(nodeData: T,  e: React.DragEvent) =\> void` |  | `WithTreeDragProps` | - The data associated with the dragged node. - The drag event. |
| `onDragOver` | `(nodeData: T,  e: React.DragEvent) =\> void` |  | `WithTreeDragProps` | - The data associated with the dragged node. - The drag event. |
| `onDragStart` | `(nodeData: T,  e: React.DragEvent) =\> void` |  | `WithTreeDragProps` | - The data associated with the dragged node. - The drag event. |
| `onDrop` | `(dropData: DropData\<T\>,  e: React.DragEvent) =\> void` |  | `WithTreeDragProps` | - The data associated with the dropped node. - The drag event. |
| `onScroll` | `(event: React.SyntheticEvent) =\> void` |  | `WithTreeDragProps` | - The scroll event. |
| `renderTree` | `(menu: React.ReactNode) =\> React.ReactNode` |  | `TreeExtraProps` | - The menu to be rendered. The rendered tree. |
| `renderTreeIcon` | `(nodeData: T,  expanded?: boolean) =\> React.ReactNode` |  | `TreeExtraProps` | - The data of the tree node. The rendered icon. |
| `renderTreeNode` | `(nodeData: T) =\> React.ReactNode` |  | `TreeExtraProps` | - The data of the tree node. The rendered node. |

---
*Auto-generated from rsuite type definitions. Refer to [rsuite documentation](https://rsuitejs.com/components/tree/#props) for full details.*
