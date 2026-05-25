import { KanbanViewConfig } from '@/components/Base/Views/KanbanView'
import { useRouter } from 'next/navigation'
import { ProductCard } from './ProductCard'

export const getProductKanbanConfig = (data: any[] = []): KanbanViewConfig => ({
  data: data,
  groupByField: 'name',
  onStateChange: async (cardId, newState) => {
    console.log('Moving card', cardId, 'to', newState)
    // API call to update status
    await fetch(`/api/admin/products/${cardId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newState })
    })
  },
  onCardDelete: async (card) => {
    if (confirm('Delete this product?')) {
      await fetch(`/api/admin/products/${card.id}`, { method: 'DELETE' })
      // Refresh data after delete
      window.location.reload()
    }
  },
  renderCard: (card) => <ProductCard card={card} />,
  cardWidth: 300,
  columnWidth: 350,
  draggable: false,
  showCardCount: true,
})
