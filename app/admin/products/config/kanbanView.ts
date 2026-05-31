import { createElement } from 'react'
import { KanbanViewConfig } from '@/components/Base/Views/KanbanView'
import { ProductCard } from './ProductCard'

export const getProductKanbanConfig = (data: any[] = []): KanbanViewConfig => ({
  data: data,
  groupByField: 'name',
  onStateChange: async (cardId, newState) => {
    console.log('Moving card', cardId, 'to', newState)
    await fetch(`/api/admin/products/${cardId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newState })
    })
  },
  onCardDelete: async (card) => {
    if (confirm('Delete this product?')) {
      await fetch(`/api/admin/products/${card.id}`, { method: 'DELETE' })
      window.location.reload()
    }
  },
  renderCard: (card) => createElement(ProductCard, { card }),
  cardWidth: 300,
  columnWidth: 350,
  draggable: true,
  showCardCount: true,
})
