'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { KanbanItemHandle } from '@/components/Base/Views/KanbanView/kanban'
import { GripVertical } from 'lucide-react'
import Image from 'next/image'
import { FaTrash } from "react-icons/fa";


interface ProductCardProps {
  card: { id: string; data: any; state?: string }
  onCardClick?: (card: { id: string; data: any }) => void
  onCardEdit?: (card: { id: string; data: any }) => void
  onCardDelete?: (card: { id: string; data: any }) => void
  showDragHandle?: boolean
}

export function ProductCard({ card, onCardClick, onCardEdit, onCardDelete, showDragHandle = false }: ProductCardProps) {
  const router = useRouter()

  const imageIds = card.data.image_ids
  const fileArray = Array.isArray(imageIds) ? imageIds : []
  const imageUrl: string | null = fileArray.length > 0 && fileArray[0]?.url ? fileArray[0].url : null

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick({ id: card.id, data: card.data })
    }
  }

  return (
    <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer rounded-sm" onClick={handleCardClick}>
      <div className="flex gap-2">
        {/* Drag Handle - only show when in Kanban context */}
        {showDragHandle && (
          <KanbanItemHandle className="cursor-grab hover:bg-gray-100 rounded p-1 mt-1">
            <GripVertical className="h-4 w-4 text-gray-400" />
          </KanbanItemHandle>
        )}
        
        {/* Product Image */}
        {imageUrl && (
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              src={imageUrl}
              alt={card.data.name || 'Product'}
              fill
              loading="eager"
              className="object-cover rounded"
              sizes="80px"
            />
          </div>
        )}
        
        {/* Card Content */}
        <div className="flex-1 space-y-2">
          <div className="font-medium">{card.data.name || 'Untitled'}</div>
          <div className="text-sm text-muted-foreground">SKU: {card.data.base_sku || '-'}</div>
          <div className="text-sm font-medium">
            Price: ${card.data.price ? parseFloat(card.data.price).toFixed(2) : '0.00'}
          </div>
          <div className="text-sm text-muted-foreground">
            Stock: {card.data.stock || 0}
          </div>
          <div className="flex gap-2 pt-2 justify-end" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              appearance="subtle"
              onClick={(e) => {
                e.stopPropagation()
                if (onCardEdit) {
                  onCardEdit({ id: card.id, data: card.data })
                } else {
                  router.push(`/admin/products/${card.id}/edit`)
                }
              }}
            >
              Edit
            </Button>
            <Button
              size="sm"
              color="red"
              startIcon={<FaTrash />}
              style={{
                color: 'red',
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
              }}
              onClick={async (e) => {
                e.stopPropagation()
                if (onCardDelete) {
                  onCardDelete({ id: card.id, data: card.data })
                } else if (confirm('Delete this product?')) {
                  await fetch(`/api/admin/products/${card.id}`, { method: 'DELETE' })
                  window.location.reload()
                }
              }}
            >
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
