import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Table, 
  Popover, 
  IconButton, 
  Whisper, 
  InputGroup, 
  Input, 
  DateRangePicker, 
  InputPicker, 
  HStack, 
  Button as RsuiteButton,
  Tag,
  Divider
} from 'rsuite'
import CloseOutlineIcon from '@rsuite/icons/CloseOutline'
import SearchIcon from '@rsuite/icons/Search'
import { 
  Search, 
  Filter, 
  X, 
  Download, 
  Grid3x3, 
  List, 
  ChevronLeft, 
  ChevronRight,
  CheckSquare,
  Square,
  SortAsc,
  SortDesc
} from 'lucide-react'
import { cn } from '@/lib/utils'

const { Column, HeaderCell, Cell } = Table

// Types
export type FilterType = 'text' | 'number' | 'date' | 'options' | 'boolean'
export type ViewType = 'list' | 'kanban' | 'grid'

export interface ListColumn {
  key: string
  title: string
  width?: number
  resizable?: boolean
  sortable?: boolean
  filterable?: boolean
  filterType?: FilterType
  filterOptions?: Array<{ label: string; value: any }>
  render?: (value: any, rowData: any) => React.ReactNode
  align?: 'left' | 'center' | 'right'
}

export interface ListViewConfig {
  title: string
  columns: ListColumn[]
  data: any[]
  showColumnToggle?: boolean
  showSearch?: boolean
  showFilters?: boolean
  showViewSwitcher?: boolean
  showExport?: boolean
  defaultVisibleColumns?: string[]
  pageSize?: number
}

export interface ListViewProps {
  config: ListViewConfig
  onRowClick?: (rowData: any) => void
  onEdit?: (rowData: any) => void
  onDelete?: (rowData: any) => void
  loading?: boolean
}

export function ListView({ config, onRowClick, onEdit, onDelete, loading }: ListViewProps) {
  const {
    columns: allColumns,
    data: initialData,
    title,
    showColumnToggle = true,
    showSearch = true,
    showFilters = true,
    showViewSwitcher = true,
    showExport = true,
    defaultVisibleColumns,
    pageSize = 20
  } = config

  const [data, setData] = useState(initialData)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [sortColumn, setSortColumn] = useState<string>()
  const [sortType, setSortType] = useState<'asc' | 'desc'>()
  const [viewType, setViewType] = useState<ViewType>('list')
  const [currentPage, setCurrentPage] = useState(1)
  const [showColumnPicker, setShowColumnPicker] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState<ListColumn[]>(
    defaultVisibleColumns 
      ? allColumns.filter(col => defaultVisibleColumns.includes(col.key))
      : allColumns
  )

  // Update data when config changes
  useEffect(() => {
    setData(initialData)
  }, [initialData])

  // Apply search and sorting
  const filteredData = useMemo(() => {
    let result = [...data]

    // Apply global search
    if (searchKeyword) {
      result = result.filter(item =>
        Object.keys(item).some(key =>
          String(item[key]).toLowerCase().includes(searchKeyword.toLowerCase())
        )
      )
    }

    // Apply sorting
    if (sortColumn && sortType) {
      result.sort((a, b) => {
        const aVal = a[sortColumn]
        const bVal = b[sortColumn]
        if (aVal < bVal) return sortType === 'asc' ? -1 : 1
        if (aVal > bVal) return sortType === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [data, searchKeyword, sortColumn, sortType])

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortType(sortType === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortType('asc')
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedData.map(row => row.id || row._id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id])
    } else {
      setSelectedIds(prev => prev.filter(rowId => rowId !== id))
    }
  }

  const handleExport = () => {
    const selectedRows = data.filter(row => selectedIds.includes(row.id || row._id))
    if (selectedRows.length === 0) {
      alert('Please select at least one row to export')
      return
    }
    // Export to CSV
    const headers = visibleColumns.map(col => col.title).join(',')
    const rows = selectedRows.map(row => 
      visibleColumns.map(col => row[col.key]).join(',')
    )
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title}_export.csv`
    a.click()
  }

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one row to delete')
      return
    }
    if (confirm(`Delete ${selectedIds.length} selected records?`)) {
      selectedIds.forEach(id => {
        const row = data.find(r => (r.id || r._id) === id)
        if (row && onDelete) {
          onDelete(row)
        }
      })
      setSelectedIds([])
    }
  }

  const toggleColumn = (columnKey: string) => {
    if (visibleColumns.find(col => col.key === columnKey)) {
      setVisibleColumns(prev => prev.filter(col => col.key !== columnKey))
    } else {
      const column = allColumns.find(col => col.key === columnKey)
      if (column) {
        setVisibleColumns(prev => [...prev, column])
      }
    }
  }

  // Render list view
  const renderListView = () => (
    <div className="w-full overflow-x-auto">
      <Table
        height={500}
        data={paginatedData}
        bordered
        cellBordered
        autoHeight
        affixHeader
        affixHorizontalScrollbar
        onRowClick={(rowData) => onRowClick && onRowClick(rowData)}
      >
        <Column width={50} align="center" fixed resizable>
          <HeaderCell>
            <input
              type="checkbox"
              checked={paginatedData.length > 0 && paginatedData.every(row => selectedIds.includes(row.id || row._id))}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="rounded"
            />
          </HeaderCell>
          <Cell>
            {(rowData: any) => (
              <input
                type="checkbox"
                checked={selectedIds.includes(rowData.id || rowData._id)}
                onChange={(e) => {
                  e.stopPropagation()
                  handleSelectRow(rowData.id || rowData._id, e.target.checked)
                }}
                onClick={(e) => e.stopPropagation()}
                className="rounded"
              />
            )}
          </Cell>
        </Column>

        {visibleColumns.map(column => (
          <Column
            key={column.key}
            width={column.width}
            resizable={column.resizable}
            sortable={column.sortable}
            fixed={column.key === 'id'}
          >
            <HeaderCell onClick={() => column.sortable && handleSort(column.key)}>
              <div className="flex items-center gap-2 cursor-pointer">
                {column.title}
                {column.sortable && sortColumn === column.key && (
                  <span className="text-xs">
                    {sortType === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </HeaderCell>
            <Cell dataKey={column.key}>
              {(rowData: any) => {
                const value = rowData[column.key]
                return column.render ? column.render(value, rowData) : value
              }}
            </Cell>
          </Column>
        ))}

        <Column width={150} fixed>
          <HeaderCell>Actions</HeaderCell>
          <Cell>
            {(rowData: any) => (
              <div className="flex gap-2">
                {onEdit && (
                  <Button
                    size="sm"
                    appearance="subtle"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(rowData)
                    }}
                  >
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="sm"
                    appearance="subtle"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(rowData)
                    }}
                  >
                    Delete
                  </Button>
                )}
              </div>
            )}
          </Cell>
        </Column>
      </Table>
    </div>
  )

  // Render kanban view
  const renderKanbanView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {paginatedData.map((row, rowIndex) => (
        <Card
          key={row.id || row._id || rowIndex}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onRowClick && onRowClick(row)}
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <input
                type="checkbox"
                checked={selectedIds.includes(row.id || row._id)}
                onChange={(e) => {
                  e.stopPropagation()
                  handleSelectRow(row.id || row._id, e.target.checked)
                }}
                onClick={(e) => e.stopPropagation()}
                className="rounded"
              />
              <div className="flex gap-1">
                {onEdit && (
                  <Button size="sm" appearance="subtle" onClick={(e) => { e.stopPropagation(); onEdit(row) }}>
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button size="sm" appearance="subtle" onClick={(e) => { e.stopPropagation(); onDelete(row) }}>
                    Delete
                  </Button>
                )}
              </div>
            </div>
            {visibleColumns.slice(0, 3).map(column => (
              <div key={column.key} className="mb-2">
                <div className="text-xs text-muted-foreground">{column.title}</div>
                <div className="font-medium">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )

  // Render grid view
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {paginatedData.map((row, rowIndex) => (
        <Card
          key={row.id || row._id || rowIndex}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onRowClick && onRowClick(row)}
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <input
                type="checkbox"
                checked={selectedIds.includes(row.id || row._id)}
                onChange={(e) => {
                  e.stopPropagation()
                  handleSelectRow(row.id || row._id, e.target.checked)
                }}
                onClick={(e) => e.stopPropagation()}
                className="rounded"
              />
              <div className="flex gap-1">
                {onEdit && (
                  <Button size="sm" appearance="subtle" onClick={(e) => { e.stopPropagation(); onEdit(row) }}>
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button size="sm" appearance="subtle" onClick={(e) => { e.stopPropagation(); onDelete(row) }}>
                    Delete
                  </Button>
                )}
              </div>
            </div>
            {visibleColumns.slice(0, 2).map(column => (
              <div key={column.key} className="mb-2">
                <div className="text-xs text-muted-foreground">{column.title}</div>
                <div className="font-medium">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {showViewSwitcher && (
            <div className="flex gap-1">
              <Button
                size="sm"
                appearance={viewType === 'list' ? 'primary' : 'default'}
                onClick={() => setViewType('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                appearance={viewType === 'kanban' ? 'primary' : 'default'}
                onClick={() => setViewType('kanban')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                appearance={viewType === 'grid' ? 'primary' : 'default'}
                onClick={() => setViewType('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
            </div>
          )}
          {showExport && (
            <Button size="sm" appearance="default" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export ({selectedIds.length})
            </Button>
          )}
          {selectedIds.length > 0 && onDelete && (
            <Button size="sm" appearance="primary" color="red" onClick={handleDeleteSelected}>
              Delete ({selectedIds.length})
            </Button>
          )}
          {showColumnToggle && (
            <Button size="sm" appearance="default" onClick={() => setShowColumnPicker(!showColumnPicker)}>
              Columns
            </Button>
          )}
        </div>
      </div>

      {/* Column picker */}
      {showColumnPicker && (
        <Card className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {allColumns.map(column => (
              <label key={column.key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns.some(col => col.key === column.key)}
                  onChange={() => toggleColumn(column.key)}
                  className="rounded"
                />
                <span className="text-sm">{column.title}</span>
              </label>
            ))}
          </div>
        </Card>
      )}

      {/* Table content */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : (
        <>
          {viewType === 'list' && renderListView()}
          {viewType === 'kanban' && renderKanbanView()}
          {viewType === 'grid' && renderGridView()}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} records
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              appearance="default"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return (
                  <Button
                    key={pageNum}
                    size="sm"
                    appearance={currentPage === pageNum ? 'primary' : 'default'}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            <Button
              size="sm"
              appearance="default"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
