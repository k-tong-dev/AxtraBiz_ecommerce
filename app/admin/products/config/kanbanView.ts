import { KanbanViewConfig } from '@/components/admin/ResourceView/KanbanView'

export const getProductKanbanConfig = (data: any[] = []): KanbanViewConfig => ({
  mode: 'state-control',
  stateField: 'status',
  columns: [
    { id: 'draft', title: 'Draft', color: 'gray', state: 'draft' },
    { id: 'published', title: 'Published', color: 'green', state: 'published' },
    { id: 'archived', title: 'Archived', color: 'red', state: 'archived' },
  ],
  data: data,
  onStateChange: async (cardId, newState) => {
    console.log('Moving card', cardId, 'to', newState)
    // API call to update status
    await fetch(`/api/products/${cardId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newState })
    })
  },
  onCardClick: (card) => console.log('Card clicked:', card),
  onCardEdit: (card) => console.log('Edit card:', card),
  onCardDelete: (card) => console.log('Delete card:', card),
  cardWidth: 300,
  columnWidth: 350,
  draggable: true,
  showCardCount: true,
})
