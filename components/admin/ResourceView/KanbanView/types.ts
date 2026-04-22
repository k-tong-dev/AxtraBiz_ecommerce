'use client'

export type KanbanMode = 'normal' | 'state-control'

export interface KanbanColumn {
  id: string
  title: string
  color?: string
  state?: string
  limit?: number
}

export interface KanbanCard {
  id: string
  data: any
  state?: string
}

export interface KanbanViewConfig {
  mode: KanbanMode
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

export interface KanbanViewProps {
  config: KanbanViewConfig
  loading?: boolean
}
