# KanbanView Component

A reusable Kanban board component with support for custom card rendering and state-based workflow management.

## Features

- **Two Modes:**
  - **Normal Mode**: Developer can develop custom design components like cards
  - **State Control Mode**: Columns displayed by state, draggable, automatically updates state field when user drags/moves

- **Configurable Columns**: Define columns with custom colors, titles, and state mappings
- **Custom Card Rendering**: Provide custom card components or use the default
- **Drag & Drop**: Full drag and drop support powered by @dnd-kit
- **State Auto-Update**: Automatically update record state when moving between columns in State Control mode
- **Card Actions**: Support for click, edit, and delete actions on cards

## Folder Structure

```
components/admin/KanbanView/
├── index.tsx          # Main KanbanView component
├── types.ts           # TypeScript type definitions
├── config/            # Configuration files (optional)
└── README.md          # This file
```

## Usage

### Basic Usage (Normal Mode)

```tsx
import { KanbanView } from '@/components/admin/ResourceView/KanbanView'

const config = {
  mode: 'normal',
  columns: [
    { id: 'todo', title: 'To Do', color: 'blue' },
    { id: 'in-progress', title: 'In Progress', color: 'yellow' },
    { id: 'done', title: 'Done', color: 'green' },
  ],
  data: myData,
  renderCard: (card) => <MyCustomCard data={card.data} />
}

<KanbanView config={config} />
```

### State Control Mode

```tsx
const config = {
  mode: 'state-control',
  stateField: 'status',
  columns: [
    { id: 'todo', title: 'To Do', state: 'todo', color: 'blue' },
    { id: 'in-progress', title: 'In Progress', state: 'in_progress', color: 'yellow' },
    { id: 'done', title: 'Done', state: 'done', color: 'green' },
  ],
  data: myData,
  onStateChange: async (cardId, newState) => {
    await api.updateCard(cardId, { status: newState })
  }
}

<KanbanView config={config} />
```

## API Reference

### KanbanViewConfig

```typescript
interface KanbanViewConfig {
  mode: 'normal' | 'state-control'
  columns: KanbanColumn[]
  data: any[]
  stateField?: string
  onCardClick?: (card: KanbanCard) => void
  onCardEdit?: (card: KanbanCard) => void
  onCardDelete?: (card: KanbanCard) => void
  onStateChange?: (cardId: string, newState: string) => Promise<void>
  renderCard?: (card: KanbanCard) => React.ReactNode
  cardWidth?: number
  columnWidth?: number
  draggable?: boolean
  showCardCount?: boolean
}
```

### KanbanColumn

```typescript
interface KanbanColumn {
  id: string
  title: string
  color?: string
  state?: string
  limit?: number
}
```

## Integration with ResourceView

The KanbanView is designed to work seamlessly with the ResourceView parent component for unified view management across your application.

See `components/admin/ResourceView/README.md` for more information.
