# Slider

**Category:** Data Entry
**Source:** `@/components/ui/RSuite/DataEntry/Slider`

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `'aria-label'` | `string` |  |  |
| `'aria-labelledby'` | `string` |  |  |
| `'aria-valuetext'` | `string` |  |  |
| `barClassName` | `string` |  |  |
| `getAriaValueText` | `(value: number, eventKey?: 'start' \| 'end') =\> string` |  |  |
| `graduated` | `boolean` |  |  |
| `handleClassName` | `string` |  |  |
| `handleStyle` | `React.CSSProperties` |  |  |
| `handleTitle` | `React.ReactNode` |  |  |
| `keepTooltipOpen` | `boolean` |  |  |
| `marks` | `{ value: number; label: React.ReactNode; }[]` |  | 6.0.0 |
| `max` | `number` |  |  |
| `min` | `number` |  |  |
| `onChangeCommitted` | `(value: T, event: React.MouseEvent) =\> void` |  |  |
| `placeholder` | `React.ReactNode` |  |  |
| `progress` | `boolean` |  |  |
| `renderMark` | `(mark: number) =\> React.ReactNode` |  |  |
| `renderTooltip` | `(value: number \| undefined) =\> React.ReactNode` |  |  |
| `size` | `Size` |  | 'sm' 6.0.0 |
| `step` | `number` |  |  |
| `tooltip` | `boolean` |  |  |
| `vertical` | `boolean` |  |  |

> **Extends:** `BoxProps`

---
*Auto-generated from rsuite type definitions. Refer to [rsuite documentation](https://rsuitejs.com/components/slider) for full details.*
