# ActionBar Component

A floating action bar (radix-style) that renders into a portal — used for row selection actions, command palettes, and contextual toolbars.

## Folder structure

```
ActionBar/
├── index.tsx        # Re-exports the public API
├── ActionBar.tsx    # Implementation
├── compose-refs.ts  # Self-contained useComposedRefs hook
└── README.md
```

The `compose-refs` hook is bundled with the feature so this component is fully self-contained — no external hook dependency.

## Parts

| Part | Description |
|---|---|
| `ActionBar` | Portal-mounted root. Renders nothing when `open` is `false`. |
| `ActionBarGroup` | A focus-managed group of items. Roving tabindex, arrow-key navigation. |
| `ActionBarItem` | A button inside the group. Dispatches a cancelable `itemSelect` event. |
| `ActionBarSelection` | Optional pill/badge showing the current selection count. |
| `ActionBarSeparator` | Visual divider (horizontal or vertical). |
| `ActionBarClose` | Closes the bar when clicked. |

## Usage

```tsx
import {
  ActionBar,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
  ActionBarClose,
  ActionBarSeparator,
} from '@/components/Base/ActionBar'

const [open, setOpen] = useState(false)

<ActionBar open={open} onOpenChange={setOpen}>
  <ActionBarGroup>
    <ActionBarSelection>{count} selected</ActionBarSelection>
    <ActionBarSeparator />
    <ActionBarItem onSelect={(e) => e.preventDefault() /* keep bar open */}>
      Edit
    </ActionBarItem>
    <ActionBarItem>Delete</ActionBarItem>
    <ActionBarSeparator />
    <ActionBarClose>Close</ActionBarClose>
  </ActionBarGroup>
</ActionBar>
```

## Props

### `ActionBar`

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | `false` | Whether the bar is visible |
| `onOpenChange` | `(open: boolean) => void` | — | Called when the bar should open/close |
| `onEscapeKeyDown` | `(e: KeyboardEvent) => void` | — | Escape key handler |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Horizontal alignment |
| `side` | `'top' \| 'bottom'` | `'bottom'` | Which edge of the viewport to attach to |
| `alignOffset` | `number` | `0` | Pixel offset along the align axis |
| `sideOffset` | `number` | `16` | Pixel offset from the edge |
| `dir` | `'ltr' \| 'rtl'` | — | Reading direction |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction |
| `loop` | `boolean` | `true` | Whether arrow keys wrap around the group |
| `portalContainer` | `Element \| DocumentFragment \| null` | `document.body` | Where to mount the portal |

### `ActionBarItem`

Inherits all `Button` props plus an `onSelect(event: Event)` callback fired after a custom `itemSelect` event is dispatched. Call `event.preventDefault()` inside the handler to keep the bar open.

## Keyboard

- `Tab` / `Shift+Tab` — leave the bar
- `ArrowLeft` / `ArrowRight` — move between items (horizontal)
- `ArrowUp` / `ArrowDown` — move between items (vertical)
- `Home` / `End` — jump to first/last item
- `Escape` — close the bar (calls `onEscapeKeyDown` then `onOpenChange(false)`)
