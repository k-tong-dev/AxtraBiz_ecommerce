'use client'

import React, { useState, useMemo } from 'react'
import { Kanban, KanbanBoard, KanbanColumn, KanbanItem, KanbanOverlay } from './kanban'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from 'rsuite'
import { Search } from 'lucide-react'
import { KanbanViewProps, KanbanMode } from './types'
import { cn } from '@/lib/utils'

export function KanbanView({ config, loading, showFilterPanel, setShowFilterPanel, searchKeyword, setSearchKeyword, filterValues }: KanbanViewProps & { showFilterPanel?: boolean; setShowFilterPanel?: (show: boolean) => void; searchKeyword?: string; setSearchKeyword?: (keyword: string) => void; filterValues?: {fieldKey: string; operator: string; value: any}[] }) {
  const {
    mode = 'normal',
    columns,
    data,
    stateField,
    onCardClick,
    onCardEdit,
    onCardDelete,
    onStateChange,
    renderCard,
    cardWidth = 280,
    columnWidth = 320,
    draggable = true,
    showCardCount = true,
  } = config

  // Use external state if provided, otherwise use local state
  const [localShowFilterPanel, setLocalShowFilterPanel] = useState(false)
  const [localSearchKeyword, setLocalSearchKeyword] = useState('')
  const filterPanelVisible = showFilterPanel !== undefined ? showFilterPanel : localShowFilterPanel
  const setFilterPanelVisible = setShowFilterPanel || setLocalShowFilterPanel
  const currentSearchKeyword = searchKeyword !== undefined ? searchKeyword : localSearchKeyword
  const setCurrentSearchKeyword = setSearchKeyword || setLocalSearchKeyword
  const currentFilterValues = filterValues || []

  const [kanbanData, setKanbanData] = useState<Record<string, any[]>>(() => {
    // Apply search keyword filter
    let filteredData = currentSearchKeyword ? data.filter(item =>
      Object.keys(item).some(key =>
        String(item[key]).toLowerCase().includes(currentSearchKeyword.toLowerCase())
      )
    ) : data

    // Apply filter values (AND logic - match all filters)
    if (currentFilterValues.length > 0) {
      filteredData = filteredData.filter(item =>
        currentFilterValues.every(filterValue => {
          const value = item[filterValue.fieldKey]
          const filterVal = filterValue.value
          
          switch (filterValue.operator) {
            case 'equals':
              // Use number comparison if filter value is a number
              if (typeof filterVal === 'number') {
                return Number(value) === filterVal
              }
              // Handle boolean comparison
              if (typeof filterVal === 'boolean') {
                return Boolean(value) === filterVal
              }
              // Handle date comparison - convert both to date and compare
              const itemDate = new Date(value)
              const filterDate = new Date(filterVal)
              if (!isNaN(itemDate.getTime()) && !isNaN(filterDate.getTime())) {
                return itemDate.toDateString() === filterDate.toDateString()
              }
              return String(value) === String(filterVal)
            case 'contains':
              return String(value).toLowerCase().includes(String(filterVal).toLowerCase())
            case 'startsWith':
              return String(value).toLowerCase().startsWith(String(filterVal).toLowerCase())
            case 'endsWith':
              return String(value).toLowerCase().endsWith(String(filterVal).toLowerCase())
            case 'gt':
              return Number(value) > Number(filterVal)
            case 'lt':
              return Number(value) < Number(filterVal)
            case 'gte':
              return Number(value) >= Number(filterVal)
            case 'lte':
              return Number(value) <= Number(filterVal)
            case 'between':
              if (Array.isArray(filterVal) && filterVal.length === 2) {
                return Number(value) >= Number(filterVal[0]) && Number(value) <= Number(filterVal[1])
              }
              return true
            default:
              return true
          }
        })
      )
    }

    if (mode === 'state-control' && stateField) {
      // Group data by state field
      const grouped: Record<string, any[]> = {}
      columns.forEach(col => {
        if (col.state) {
          grouped[col.state] = filteredData.filter(item => item[stateField] === col.state)
        }
      })
      return grouped
    } else {
      // Normal mode: use column IDs as keys
      const grouped: Record<string, any[]> = {}
      columns.forEach(col => {
        grouped[col.id] = filteredData.filter(item => item.columnId === col.id)
      })
      return grouped
    }
  })

  // Update kanbanData when search keyword or filter values changes
  React.useEffect(() => {
    // Apply search keyword filter
    let filteredData = currentSearchKeyword ? data.filter(item =>
      Object.keys(item).some(key =>
        String(item[key]).toLowerCase().includes(currentSearchKeyword.toLowerCase())
      )
    ) : data

    // Apply filter values (AND logic - match all filters)
    if (currentFilterValues.length > 0) {
      filteredData = filteredData.filter(item =>
        currentFilterValues.every(filterValue => {
          const value = item[filterValue.fieldKey]
          const filterVal = filterValue.value
          
          switch (filterValue.operator) {
            case 'equals':
              // Use number comparison if filter value is a number
              if (typeof filterVal === 'number') {
                return Number(value) === filterVal
              }
              // Handle boolean comparison
              if (typeof filterVal === 'boolean') {
                return Boolean(value) === filterVal
              }
              // Handle date comparison - convert both to date and compare
              const itemDate = new Date(value)
              const filterDate = new Date(filterVal)
              if (!isNaN(itemDate.getTime()) && !isNaN(filterDate.getTime())) {
                return itemDate.toDateString() === filterDate.toDateString()
              }
              return String(value) === String(filterVal)
            case 'contains':
              return String(value).toLowerCase().includes(String(filterVal).toLowerCase())
            case 'startsWith':
              return String(value).toLowerCase().startsWith(String(filterVal).toLowerCase())
            case 'endsWith':
              return String(value).toLowerCase().endsWith(String(filterVal).toLowerCase())
            case 'gt':
              return Number(value) > Number(filterVal)
            case 'lt':
              return Number(value) < Number(filterVal)
            case 'gte':
              return Number(value) >= Number(filterVal)
            case 'lte':
              return Number(value) <= Number(filterVal)
            case 'between':
              if (Array.isArray(filterVal) && filterVal.length === 2) {
                return Number(value) >= Number(filterVal[0]) && Number(value) <= Number(filterVal[1])
              }
              return true
            default:
              return true
          }
        })
      )
    }

    if (mode === 'state-control' && stateField) {
      const grouped: Record<string, any[]> = {}
      columns.forEach(col => {
        if (col.state) {
          grouped[col.state] = filteredData.filter(item => item[stateField] === col.state)
        }
      })
      setKanbanData(grouped)
    } else {
      const grouped: Record<string, any[]> = {}
      columns.forEach(col => {
        grouped[col.id] = filteredData.filter(item => item.columnId === col.id)
      })
      setKanbanData(grouped)
    }
  }, [data, currentSearchKeyword, currentFilterValues, mode, stateField, columns])

  const handleDragEnd = async (event: any) => {
    if (!draggable || mode !== 'state-control' || !onStateChange) return

    const { active, over } = event
    if (!over) return

    const activeColumn = columns.find(col => col.id === active.id)
    const overColumn = columns.find(col => col.id === over.id)

    if (activeColumn?.state && overColumn?.state && activeColumn.state !== overColumn.state) {
      // Find the item that was moved
      const movedItem = kanbanData[activeColumn.state]?.find(item => item.id === active.id)
      if (movedItem) {
        // Update the state
        await onStateChange(movedItem.id, overColumn.state)
      }
    }
  }

  const handleValueChange = (newColumns: Record<string, any[]>) => {
    setKanbanData(newColumns)
  }

  const getItemValue = (item: any) => item.id || item._id

  // Find active item for overlay
  const getActiveItem = () => {
    for (const [columnId, items] of Object.entries(kanbanData)) {
      const item = items.find(item => getItemValue(item) === undefined)
      if (item) return { item, columnId }
    }
    return null
  }

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>
  }

  return (
    <div className="w-full h-full">
      {/* Filter panel */}
      {filterPanelVisible && (
        <Card className="p-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search cards..."
                value={currentSearchKeyword}
                onChange={(value: string) => setCurrentSearchKeyword(value)}
                style={{ width: '100%', paddingLeft: 36 }}
              />
            </div>
            <Button size="sm" appearance="subtle" onClick={() => setFilterPanelVisible(false)}>
              Close
            </Button>
          </div>
        </Card>
      )}
      <div className="w-full h-full overflow-x-auto">
      <Kanban
        value={kanbanData}
        onValueChange={handleValueChange}
        onDragEnd={handleDragEnd}
        getItemValue={getItemValue}
        orientation="horizontal"
      >
        <KanbanBoard className="p-4">
          {columns.map(column => (
            <KanbanColumn
              key={column.id}
              value={column.id}
              style={{ width: columnWidth, minWidth: columnWidth }}
            >
              <div className="flex flex-col h-full">
                {/* Column Header */}
                <div
                  className={cn(
                    "p-3 rounded-t-lg font-medium flex items-center justify-between",
                    column.color ? `bg-${column.color}-300` : "bg-zinc-300"
                  )}
                >
                  <span>{column.title}</span>
                  {showCardCount && (
                    <span className="text-sm text-muted-foreground">
                      {kanbanData[column.id]?.length || 0}
                    </span>
                  )}
                </div>

                {/* Column Items */}
                <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                  {(kanbanData[column.id] || []).map(item => (
                    <KanbanItem
                      key={getItemValue(item)}
                      value={getItemValue(item)}
                      asHandle={draggable}
                    >
                      {renderCard ? (
                        renderCard({ id: getItemValue(item), data: item, state: column.state })
                      ) : (
                        <DefaultCard
                          item={item}
                          onCardEdit={onCardEdit}
                          onCardDelete={onCardDelete}
                        />
                      )}
                    </KanbanItem>
                  ))}
                </div>
              </div>
            </KanbanColumn>
          ))}
        </KanbanBoard>
        <KanbanOverlay>
          {({ value, variant }) => {
            if (variant === 'column') {
              const column = columns.find(col => col.id === value)
              return column ? (
                <div className="w-80 bg-zinc-100 rounded-lg p-4 shadow-xl">
                  <div className="font-medium">{column.title}</div>
                  <div className="text-sm text-muted-foreground">{kanbanData[column.id]?.length || 0} items</div>
                </div>
              ) : null
            }
            if (variant === 'item') {
              for (const [columnId, items] of Object.entries(kanbanData)) {
                const item = items.find(i => getItemValue(i) === value)
                if (item) {
                  return (
                    <Card className="p-3 shadow-xl cursor-grabbing w-64">
                      <div className="space-y-2">
                        <div className="font-medium">{item.name || item.title || 'Untitled'}</div>
                        {item.description && (
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </Card>
                  )
                }
              }
            }
            return null
          }}
        </KanbanOverlay>
      </Kanban>
      </div>
    </div>
  )
}

function DefaultCard({
  item,
  onCardEdit,
  onCardDelete,
}: {
  item: any
  onCardEdit?: (card: { id: string; data: any }) => void
  onCardDelete?: (card: { id: string; data: any }) => void
}) {
  return (
    <Card className="p-3 hover:shadow-md transition-shadow">
      <div className="space-y-2">
        <div className="font-medium">{item.name || item.title || 'Untitled'}</div>
        {item.description && (
          <div className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </div>
        )}
        <div className="flex gap-2 pt-2">
          {onCardEdit && (
            <Button
              size="sm"
              appearance="subtle"
              onClick={(e) => {
                e.stopPropagation()
                onCardEdit({ id: item.id || item._id, data: item })
              }}
            >
              Edit
            </Button>
          )}
          {onCardDelete && (
            <Button
              size="sm"
              appearance="subtle"
              onClick={(e) => {
                e.stopPropagation()
                onCardDelete({ id: item.id || item._id, data: item })
              }}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

export * from './types'
