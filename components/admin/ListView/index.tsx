import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
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
  Divider,
  Pagination,
  Placeholder,
  Loader
} from 'rsuite'
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

// Export configs
export * from './config'

// Types
export type FilterType = 'text' | 'number' | 'date' | 'options' | 'boolean'
export type ViewType = 'list' | 'kanban' | 'grid' | 'gantt' | 'tree'

export interface FilterValue {
  type: FilterType
  value: any
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte' | 'between'
}

export interface ColumnFilter {
  columnKey: string
  values: FilterValue[]
}

export interface ListColumn {
  key: string
  title: string
  width?: number
  resizable?: boolean
  sortable?: boolean
  filterable?: boolean
  filterType?: FilterType
  filterOptions?: Array<{ label: string; value: any }>
  filterDataFetcher?: () => Promise<Array<{ label: string; value: any }>>
  filterDefault?: any
  render?: (value: any, rowData: any) => React.ReactNode
  align?: 'left' | 'center' | 'right'
  groupable?: boolean
  isDate?: boolean
  isNumber?: boolean
  summary?: boolean
  summaryType?: 'sum' | 'count' | 'avg' | 'min' | 'max'
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
  enableGroupBy?: boolean
  enableGanttView?: boolean
  ganttStartDateKey?: string
  ganttEndDateKey?: string
  ganttTitleKey?: string
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
    pageSize = 20,
    enableGroupBy = false,
    enableGanttView = false,
    ganttStartDateKey,
    ganttEndDateKey,
    ganttTitleKey
  } = config

  const [data, setData] = useState(initialData)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [sortColumn, setSortColumn] = useState<string>()
  const [sortType, setSortType] = useState<'asc' | 'desc'>()
  const [viewType, setViewType] = useState<ViewType>('list')
  const [currentPage, setCurrentPage] = useState(1)
  const [showColumnPicker, setShowColumnPicker] = useState(false)
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [groupColumn, setGroupColumn] = useState<string>()
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([])
  const [pendingFilters, setPendingFilters] = useState<ColumnFilter[]>([])
  const [dynamicFilterData, setDynamicFilterData] = useState<Record<string, Array<{ label: string; value: any }>>>({})
  const [visibleColumns, setVisibleColumns] = useState<ListColumn[]>(
    defaultVisibleColumns 
      ? allColumns.filter(col => defaultVisibleColumns.includes(col.key))
      : allColumns
  )

  // Initialize filters with default values
  useEffect(() => {
    const defaultFilters: ColumnFilter[] = []
    allColumns.forEach(column => {
      if (column.filterable && column.filterDefault !== undefined) {
        let filterValue: FilterValue
        switch (column.filterType) {
          case 'boolean':
            filterValue = { type: 'boolean', value: column.filterDefault }
            break
          case 'number':
            filterValue = { type: 'number', value: column.filterDefault, operator: 'equals' }
            break
          case 'options':
            filterValue = { type: 'options', value: column.filterDefault }
            break
          case 'text':
            filterValue = { type: 'text', value: column.filterDefault, operator: 'contains' }
            break
          default:
            filterValue = { type: 'text', value: column.filterDefault, operator: 'equals' }
        }
        defaultFilters.push({ columnKey: column.key, values: [filterValue] })
      }
    })
    if (defaultFilters.length > 0) {
      setColumnFilters(defaultFilters)
      setPendingFilters(defaultFilters)
    }
  }, [allColumns])

  // Sync pending filters with applied filters when panel opens
  useEffect(() => {
    if (showFilterPanel) {
      setPendingFilters(columnFilters)
    }
  }, [showFilterPanel, columnFilters])

  // Update data when config changes
  useEffect(() => {
    setData(initialData)
  }, [initialData])

  // Fetch dynamic filter data on mount
  useEffect(() => {
    const fetchDynamicData = async () => {
      const data: Record<string, Array<{ label: string; value: any }>> = {}
      for (const column of allColumns) {
        if (column.filterDataFetcher) {
          try {
            const options = await column.filterDataFetcher()
            data[column.key] = options
          } catch (error) {
            console.error(`Failed to fetch filter data for ${column.key}:`, error)
          }
        }
      }
      setDynamicFilterData(data)
    }
    fetchDynamicData()
  }, [allColumns])

  // Apply search, filters, and sorting
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

    // Apply column filters
    columnFilters.forEach(filter => {
      const column = allColumns.find(col => col.key === filter.columnKey)
      if (!column) return

      filter.values.forEach(filterValue => {
        result = result.filter(item => {
          const value = item[filter.columnKey]
          switch (filterValue.type) {
            case 'text':
              if (filterValue.operator === 'contains') {
                return String(value).toLowerCase().includes(String(filterValue.value).toLowerCase())
              } else if (filterValue.operator === 'equals') {
                return String(value) === String(filterValue.value)
              }
              return true
            case 'number':
              if (filterValue.operator === 'gt') return Number(value) > Number(filterValue.value)
              if (filterValue.operator === 'lt') return Number(value) < Number(filterValue.value)
              if (filterValue.operator === 'gte') return Number(value) >= Number(filterValue.value)
              if (filterValue.operator === 'lte') return Number(value) <= Number(filterValue.value)
              if (filterValue.operator === 'equals') return Number(value) === Number(filterValue.value)
              return true
            case 'options':
              return filterValue.value.includes(value)
            case 'boolean':
              return Boolean(value) === Boolean(filterValue.value)
            case 'date':
              // Date comparison
              const dateValue = new Date(value)
              if (filterValue.operator === 'between' && Array.isArray(filterValue.value) && filterValue.value.length === 2) {
                const startDate = new Date(filterValue.value[0])
                const endDate = new Date(filterValue.value[1])
                // Set end date to end of day for inclusive comparison
                endDate.setHours(23, 59, 59, 999)
                return dateValue >= startDate && dateValue <= endDate
              }
              const filterDate = new Date(filterValue.value)
              if (filterValue.operator === 'gt') return dateValue > filterDate
              if (filterValue.operator === 'lt') return dateValue < filterDate
              if (filterValue.operator === 'equals') return dateValue.getTime() === filterDate.getTime()
              return true
            default:
              return true
          }
        })
      })
    })

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
  }, [data, searchKeyword, sortColumn, sortType, columnFilters, allColumns])

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

  const handleSortColumn = (dataKey: string, sortType?: any) => {
    setSortColumn(dataKey)
    if (sortType) setSortType(sortType)
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

  const handleAddPendingFilter = (columnKey: string, filterValue: FilterValue) => {
    // Don't add empty filters
    if (filterValue.value === '' || filterValue.value === null || filterValue.value === undefined) {
      setPendingFilters(prev => {
        const existingFilter = prev.find(f => f.columnKey === columnKey)
        if (existingFilter) {
          // Remove only the specific operator value, keep other operators
          const remainingValues = existingFilter.values.filter(v => v.operator !== filterValue.operator)
          if (remainingValues.length === 0) {
            return prev.filter(f => f.columnKey !== columnKey)
          }
          return prev.map(f => 
            f.columnKey === columnKey 
              ? { ...f, values: remainingValues }
              : f
          )
        }
        return prev
      })
      return
    }

    setPendingFilters(prev => {
      const existingFilter = prev.find(f => f.columnKey === columnKey)
      if (existingFilter) {
        // For boolean, text, and options filters, replace the value instead of appending
        if (filterValue.type === 'boolean' || filterValue.type === 'text' || filterValue.type === 'options') {
          return prev.map(f => 
            f.columnKey === columnKey 
              ? { ...f, values: [filterValue] }
              : f
          )
        }
        // For number filters, replace the specific operator value
        if (filterValue.type === 'number') {
          return prev.map(f => 
            f.columnKey === columnKey 
              ? { ...f, values: [...f.values.filter(v => v.operator !== filterValue.operator), filterValue] }
              : f
          )
        }
        return prev.map(f => 
          f.columnKey === columnKey 
            ? { ...f, values: [...f.values, filterValue] }
            : f
        )
      } else {
        return [...prev, { columnKey, values: [filterValue] }]
      }
    })
  }

  const handleApplyFilters = () => {
    setColumnFilters(pendingFilters)
    setShowFilterPanel(false)
  }

  const handleClearPendingFilters = () => {
    setPendingFilters(columnFilters)
  }

  const handleClearAllFilters = () => {
    setPendingFilters([])
    setColumnFilters([])
  }

  const getActiveFilterCount = () => {
    return columnFilters.reduce((count, filter) => count + filter.values.length, 0)
  }

  const getPendingFilterCount = () => {
    return pendingFilters.reduce((count, filter) => count + filter.values.length, 0)
  }

  // Transform data for tree view (group by)
  const treeData = useMemo(() => {
    if (!groupColumn || viewType !== 'tree') return paginatedData
    
    const groups: Record<string, any[]> = {}
    paginatedData.forEach(row => {
      const groupValue = row[groupColumn] || 'Uncategorized'
      if (!groups[groupValue]) {
        groups[groupValue] = []
      }
      groups[groupValue].push(row)
    })
    
    return Object.entries(groups).map(([groupKey, rows]) => ({
      id: groupKey,
      [groupColumn]: groupKey,
      _children: rows,
      _isGroup: true
    }))
  }, [paginatedData, groupColumn, viewType])

  // Render loading state
  const renderLoading = () => {
    return (
      <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'var(--rs-bg-card)', padding: 20, zIndex: 1 }}>
        <Placeholder.Grid rows={10} columns={visibleColumns.length + 2} active />
      </div>
    )
  }

  // Calculate column summaries
  const calculateSummary = (columnKey: string, summaryType?: 'sum' | 'count' | 'avg' | 'min' | 'max') => {
    if (!summaryType) return null
    
    const values = filteredData.map(row => row[columnKey]).filter(v => v !== null && v !== undefined && !isNaN(Number(v)))
    
    if (values.length === 0) return null
    
    switch (summaryType) {
      case 'sum':
        return values.reduce((acc, val) => acc + Number(val), 0)
      case 'count':
        return values.length
      case 'avg':
        return values.reduce((acc, val) => acc + Number(val), 0) / values.length
      case 'min':
        return Math.min(...values.map(Number))
      case 'max':
        return Math.max(...values.map(Number))
      default:
        return null
    }
  }

  // Render list view
  const renderListView = () => (
    <div className="w-full overflow-x-auto">
      <Table
        height={500}
        data={viewType === 'tree' ? treeData : paginatedData}
        bordered
        cellBordered
        autoHeight
        affixHeader
        affixHorizontalScrollbar
        onRowClick={(rowData) => onRowClick && !rowData._isGroup && onRowClick(rowData)}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
        loading={loading}
        renderLoading={renderLoading}
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

        {visibleColumns.map(column => {
          const summary = calculateSummary(column.key, column.summaryType)
          return (
            <Column
              key={column.key}
              width={column.width}
              resizable={column.resizable}
              sortable={column.sortable}
              fixed={column.key === 'id'}
              align={column.align}
            >
              <HeaderCell>
                {column.summary && summary !== null ? (
                  <div>
                    <label>{column.title}</label>
                    <div style={{ fontSize: 14, color: '#2eabdf', fontWeight: 'bold' }}>
                      {(() => {
                        switch (column.summaryType) {
                          case 'sum': return `Total: ${summary.toLocaleString()}`
                          case 'count': return `Count: ${summary}`
                          case 'avg': return `Avg: ${summary.toFixed(2)}`
                          case 'min': return `Min: ${summary.toLocaleString()}`
                          case 'max': return `Max: ${summary.toLocaleString()}`
                          default: return summary.toLocaleString()
                        }
                      })()}
                    </div>
                  </div>
                ) : (
                  column.title
                )}
              </HeaderCell>
              <Cell dataKey={column.key}>
                {(rowData: any) => {
                  const value = rowData[column.key]
                  return column.render ? column.render(value, rowData) : value
                }}
              </Cell>
            </Column>
          )
        })}

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

  // Render Gantt view
  const renderGanttView = () => {
    if (!ganttStartDateKey || !ganttEndDateKey || !ganttTitleKey) {
      return <div className="text-center py-8 text-muted-foreground">Gantt view requires startDate, endDate, and title keys in config</div>
    }

    // Calculate date range
    const allDates = paginatedData.flatMap(row => [
      new Date(row[ganttStartDateKey]),
      new Date(row[ganttEndDateKey])
    ])
    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())))
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())))
    const dayRange = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

    return (
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Timeline header */}
          <div className="flex border-b">
            <div className="w-64 flex-shrink-0 p-2 font-medium border-r">Task</div>
            <div className="flex-1 flex">
              {Array.from({ length: dayRange }, (_, i) => {
                const date = new Date(minDate)
                date.setDate(date.getDate() + i)
                return (
                  <div key={i} className="flex-1 p-2 text-xs border-r text-center">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Timeline rows */}
          {paginatedData.map((row, index) => {
            const startDate = new Date(row[ganttStartDateKey])
            const endDate = new Date(row[ganttEndDateKey])
            const startOffset = Math.ceil((startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))
            const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

            return (
              <div key={row.id || row._id || index} className="flex border-b hover:bg-muted/50">
                <div className="w-64 flex-shrink-0 p-2 border-r text-sm">
                  {row[ganttTitleKey] || `Task ${index + 1}`}
                </div>
                <div className="flex-1 relative p-1">
                  <div
                    className="absolute h-6 bg-blue-500 rounded cursor-pointer hover:bg-blue-600 transition-colors"
                    style={{
                      left: `${(startOffset / dayRange) * 100}%`,
                      width: `${(duration / dayRange) * 100}%`,
                      top: '4px'
                    }}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    <span className="text-xs text-white px-1 truncate block">
                      {row[ganttTitleKey] || `Task ${index + 1}`}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

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
                onChange={(value:string) => setSearchKeyword(value)}
                className="pl-10"
              />
            </div>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {showFilters && (
            <Button 
              size="sm" 
              appearance={showFilterPanel ? 'primary' : 'default'}
              onClick={() => setShowFilterPanel(!showFilterPanel)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {getActiveFilterCount() > 0 && (
                <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {getActiveFilterCount()}
                </span>
              )}
            </Button>
          )}
          {enableGroupBy && (
            <InputPicker
              size="sm"
              placeholder="Group by..."
              data={allColumns.filter(col => col.groupable).map(col => ({ label: col.title, value: col.key }))}
              value={groupColumn}
              onChange={(value) => {
                setGroupColumn(value)
                if (value) {
                  setViewType('tree')
                } else {
                  setViewType('list')
                }
              }}
              cleanable
              style={{ width: 150 }}
            />
          )}
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
              {enableGroupBy && (
                <Button
                  size="sm"
                  appearance={viewType === 'tree' ? 'primary' : 'default'}
                  onClick={() => setViewType('tree')}
                >
                  <List className="h-4 w-4" />
                </Button>
              )}
              {enableGanttView && (
                <Button
                  size="sm"
                  appearance={viewType === 'gantt' ? 'primary' : 'default'}
                  onClick={() => setViewType('gantt')}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
              )}
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

      {/* Filter panel */}
      {showFilterPanel && (
        <Card className="p-6">
          <HStack className="mb-4" spacing={16} alignItems="center">
            <h3 className="font-medium">Filters</h3>
            <div className="flex gap-2">
              {getActiveFilterCount() > 0 && (
                <Tag color="green">{getActiveFilterCount()} Applied</Tag>
              )}
              {getPendingFilterCount() > 0 && getPendingFilterCount() !== getActiveFilterCount() && (
                <Tag color="blue">Changed</Tag>
              )}
              <Button size="sm" appearance="subtle" onClick={handleClearPendingFilters}>
                Reset
              </Button>
              <Button size="sm" appearance="subtle" onClick={handleClearAllFilters}>
                Clear All
              </Button>
            </div>
            
          </HStack>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allColumns.filter(col => col.filterable).map(column => (
              <div key={column.key} className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{column.title}</label>
                {column.filterType === 'text' && (
                  <InputGroup inside>
                    <Input
                      placeholder={`Filter by ${column.title}...`}
                      value={pendingFilters.find(f => f.columnKey === column.key)?.values[0]?.value || ''}
                      onChange={(value) => handleAddPendingFilter(column.key, { type: 'text', value, operator: 'contains' })}
                    />
                    <InputGroup.Button>
                      <Filter className="h-4 w-4" />
                    </InputGroup.Button>
                  </InputGroup>
                )}
                {column.filterType === 'number' && (
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={pendingFilters.find(f => f.columnKey === column.key)?.values.find(v => v.operator === 'gte')?.value || ''}
                      onChange={(value) => handleAddPendingFilter(column.key, { type: 'number', value, operator: 'gte' })}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={pendingFilters.find(f => f.columnKey === column.key)?.values.find(v => v.operator === 'lte')?.value || ''}
                      onChange={(value) => handleAddPendingFilter(column.key, { type: 'number', value, operator: 'lte' })}
                    />
                  </div>
                )}
                {column.filterType === 'date' && (
                  <DateRangePicker
                    placeholder="Select date range"
                    value={pendingFilters.find(f => f.columnKey === column.key)?.values[0]?.value || null}
                    onChange={(value) => {
                      if (value && value.length === 2) {
                        handleAddPendingFilter(column.key, { type: 'date', value: value, operator: 'between' })
                      } else if (!value) {
                        handleAddPendingFilter(column.key, { type: 'date', value: null, operator: 'between' })
                      }
                    }}
                    block
                    cleanable
                  />
                )}
                {column.filterType === 'options' && (
                  <InputPicker
                    data={column.filterOptions || dynamicFilterData[column.key] || []}
                    placeholder={`Select ${column.title}...`}
                    value={pendingFilters.find(f => f.columnKey === column.key)?.values[0]?.value || null}
                    onChange={(value) => handleAddPendingFilter(column.key, { type: 'options', value })}
                    block
                    cleanable
                  />
                )}
                {column.filterType === 'boolean' && (
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={pendingFilters.find(f => f.columnKey === column.key)?.values[0]?.value === true}
                      onChange={(checked) => {
                        handleAddPendingFilter(column.key, { type: 'boolean', value: checked })
                      }}
                      checkedChildren="True"
                      unCheckedChildren="False"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <Divider className="my-6" />
          <HStack justifyContent="flex-end" spacing={8}>
            <Button size="sm" appearance="subtle" onClick={() => setShowFilterPanel(false)}>
              Cancel
            </Button>
            <Button size="sm" appearance="primary" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </HStack>
        </Card>
      )}

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
          {viewType === 'tree' && renderListView()}
          {viewType === 'gantt' && renderGanttView()}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ padding: 20 }}>
          <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            maxButtons={5}
            size="xs"
            layout={['total', '-', 'limit', '|', 'pager', 'skip']}
            total={filteredData.length}
            limitOptions={[10, 20, 30, 50]}
            limit={pageSize}
            activePage={currentPage}
            onChangePage={setCurrentPage}
            onChangeLimit={(limit) => {
              setCurrentPage(1)
              // Update pageSize in config or state if needed
            }}
          />
        </div>
      )}
    </div>
  )
}
