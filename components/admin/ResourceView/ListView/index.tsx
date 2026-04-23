import React, {useState, useEffect, useMemo, useRef} from 'react'
import {Button} from '@/components/ui/button'
import {Card} from '@/components/ui/card'
import {Switch} from '@/components/ui/switch'
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
    Loader,
    Checkbox,
    Center,
    Drawer,
    ButtonToolbar,
    Modal
} from 'rsuite'
import {ServerActions, ServerActionConfig, ActionContext, ConfirmationModal} from '../ServerActions'
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
    SortDesc,
    Settings,
    FileSpreadsheet,
    Trash2
} from 'lucide-react'
import {cn} from '@/lib/utils'
import {CiMenuKebab} from "react-icons/ci";

const {Column, HeaderCell, Cell} = Table

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
    bulkActions?: BulkActionConfig[]
}

// BulkActionConfig is now deprecated - use ServerActionConfig instead
export interface BulkActionConfig {
    label: string
    icon?: React.ReactNode
    color?: 'blue' | 'green' | 'red' | 'orange' | 'violet' | 'yellow' | 'cyan'
    onClick: (selectedIds: string[], selectedData: any[]) => void
    show?: (selectedIds: string[], selectedData: any[]) => boolean
    confirm?: string | ((selectedIds: string[], selectedData: any[]) => string)
    helper?: string
}

// Convert BulkActionConfig to ServerActionConfig for compatibility
function convertToServerAction(config: BulkActionConfig): ServerActionConfig {
    return {
        key: config.label.toLowerCase().replace(/\s+/g, '_'),
        label: config.label,
        icon: config.icon,
        color: config.color,
        onClick: (data, context) => {
            const selectedIds = context?.selectedIds || []
            config.onClick(selectedIds, data)
        },
        show: (data, context) => {
            const selectedIds = context?.selectedIds || []
            return config.show ? config.show(selectedIds, data) : true
        },
        confirm: config.confirm ? (data, context) => {
            const selectedIds = context?.selectedIds || []
            if (typeof config.confirm === 'function') {
                return config.confirm(selectedIds, data)
            }
            return config.confirm as string
        } : undefined,
        helper: config.helper,
        mode: 'bulk'
    }
}

export interface ListViewProps {
    config: ListViewConfig
    onRowClick?: (rowData: any) => void
    onEdit?: (rowData: any) => void
    onDelete?: (rowData: any) => void
    loading?: boolean
    showFilterPanel?: boolean
    setShowFilterPanel?: (show: boolean) => void
    searchKeyword?: string
    setSearchKeyword?: (keyword: string) => void
    showColumnPicker?: boolean
    setShowColumnPicker?: (show: boolean) => void
    selectedIds?: string[]
    setSelectedIds?: (ids: string[]) => void
    actionsDrawerOpen?: boolean
    setActionsDrawerOpen?: (open: boolean) => void
}

export function ListView({
                             config,
                             onRowClick,
                             onEdit,
                             onDelete,
                             loading,
                             showFilterPanel: externalShowFilterPanel,
                             setShowFilterPanel: externalSetShowFilterPanel,
                             searchKeyword: externalSearchKeyword,
                             setSearchKeyword: externalSetSearchKeyword,
                             showColumnPicker: externalShowColumnPicker,
                             setShowColumnPicker: externalSetShowColumnPicker,
                             selectedIds: externalSelectedIds,
                             setSelectedIds: externalSetSelectedIds,
                             actionsDrawerOpen: externalActionsDrawerOpen,
                             setActionsDrawerOpen: externalSetActionsDrawerOpen
                         }: ListViewProps) {
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
        ganttTitleKey,
        bulkActions: configBulkActions
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
    const [headerColumnPickerOpen, setHeaderColumnPickerOpen] = useState(false)
    const [actionsDrawerOpen, setActionsDrawerOpen] = useState(false)
    const [confirmModalOpen, setConfirmModalOpen] = useState(false)
    const [confirmModalConfig, setConfirmModalConfig] = useState<{
        message: string
        onConfirm: () => void
    } | null>(null)
    const [actionContext, setActionContext] = useState<ActionContext>({
        mode: 'bulk',
        view: 'list',
        selectedIds: selectedIds
    })

    // Use external state if provided (from ResourceView), otherwise use local state
    const filterPanelVisible = externalShowFilterPanel !== undefined ? externalShowFilterPanel : showFilterPanel
    const setFilterPanelVisible = externalSetShowFilterPanel || setShowFilterPanel
    const currentSearchKeyword = externalSearchKeyword !== undefined ? externalSearchKeyword : searchKeyword
    const setCurrentSearchKeyword = externalSetSearchKeyword || setSearchKeyword
    const columnPickerVisible = externalShowColumnPicker !== undefined ? externalShowColumnPicker : showColumnPicker
    const setColumnPickerVisible = externalSetShowColumnPicker || setShowColumnPicker
    const currentSelectedIds = externalSelectedIds !== undefined ? externalSelectedIds : selectedIds
    const setCurrentSelectedIds = externalSetSelectedIds || setSelectedIds
    const currentActionsDrawerOpen = externalActionsDrawerOpen !== undefined ? externalActionsDrawerOpen : actionsDrawerOpen
    const setCurrentActionsDrawerOpen = externalSetActionsDrawerOpen || setActionsDrawerOpen

    // Update action context when selectedIds change
    useEffect(() => {
        setActionContext(prev => ({
            ...prev,
            selectedIds: currentSelectedIds
        }))
    }, [currentSelectedIds])

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
                        filterValue = {type: 'boolean', value: column.filterDefault}
                        break
                    case 'number':
                        filterValue = {type: 'number', value: column.filterDefault, operator: 'equals'}
                        break
                    case 'options':
                        filterValue = {type: 'options', value: column.filterDefault}
                        break
                    case 'text':
                        filterValue = {type: 'text', value: column.filterDefault, operator: 'contains'}
                        break
                    default:
                        filterValue = {type: 'text', value: column.filterDefault, operator: 'equals'}
                }
                defaultFilters.push({columnKey: column.key, values: [filterValue]})
            }
        })
        if (defaultFilters.length > 0) {
            setColumnFilters(defaultFilters)
            setPendingFilters(defaultFilters)
        }
    }, [allColumns])

    // Sync pending filters with applied filters when panel opens
    useEffect(() => {
        if (filterPanelVisible) {
            setPendingFilters(columnFilters)
        }
    }, [filterPanelVisible, columnFilters])

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
        if (currentSearchKeyword) {
            result = result.filter(item =>
                Object.keys(item).some(key =>
                    String(item[key]).toLowerCase().includes(currentSearchKeyword.toLowerCase())
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
    }, [data, currentSearchKeyword, sortColumn, sortType, columnFilters, allColumns])

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
            setCurrentSelectedIds(paginatedData.map(row => row.id || row._id))
        } else {
            setCurrentSelectedIds([])
        }
    }

    const handleSelectRow = (id: string, checked: boolean) => {
        if (checked) {
            setCurrentSelectedIds([...currentSelectedIds, id])
        } else {
            setCurrentSelectedIds(currentSelectedIds.filter(rowId => rowId !== id))
        }
    }

    const handleDeleteSelected = () => {
        if (currentSelectedIds.length === 0) {
            alert('Please select at least one row to delete')
            return
        }
        if (confirm(`Delete ${currentSelectedIds.length} selected records?`)) {
            currentSelectedIds.forEach(id => {
                const row = data.find(r => (r.id || r._id) === id)
                if (row && onDelete) {
                    onDelete(row)
                }
            })
            setCurrentSelectedIds([])
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
                            ? {...f, values: remainingValues}
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
                            ? {...f, values: [filterValue]}
                            : f
                    )
                }
                // For number filters, replace the specific operator value
                if (filterValue.type === 'number') {
                    return prev.map(f =>
                        f.columnKey === columnKey
                            ? {
                                ...f,
                                values: [...f.values.filter(v => v.operator !== filterValue.operator), filterValue]
                            }
                            : f
                    )
                }
                return prev.map(f =>
                    f.columnKey === columnKey
                        ? {...f, values: [...f.values, filterValue]}
                        : f
                )
            } else {
                return [...prev, {columnKey, values: [filterValue]}]
            }
        })
    }

    const handleApplyFilters = () => {
        setColumnFilters(pendingFilters)
        setFilterPanelVisible(false)
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
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'var(--rs-bg-card)',
                padding: 20,
                zIndex: 1
            }}>
                <Placeholder.Grid rows={10} columns={visibleColumns.length + 2} active/>
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
        <div className="w-full overflow-x-auto pt-4">
            <Table
                height={500}
                headerHeight={80}
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
                <Column width={35} align="center" fixed resizable={false}>
                    <HeaderCell style={{padding: 0}}>
                        <Center>
                            <Checkbox
                                inline
                                checked={paginatedData.length > 0 && paginatedData.every(row => currentSelectedIds.includes(row.id || row._id))}
                                indeterminate={paginatedData.length > 0 && currentSelectedIds.length > 0 && !paginatedData.every(row => currentSelectedIds.includes(row.id || row._id))}
                                onChange={(value, checked) => handleSelectAll(checked)}
                            />
                        </Center>
                    </HeaderCell>
                    <Cell>
                        {(rowData: any) => (
                            <div onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                    checked={currentSelectedIds.includes(rowData.id || rowData._id)}
                                    onChange={(value, checked, event) => {
                                        event?.stopPropagation()
                                        handleSelectRow(rowData.id || rowData._id, checked)
                                    }}
                                />
                            </div>
                        )}
                    </Cell>
                </Column>

                <Column width={30} align="center" fixed>
                    <HeaderCell style={{padding: 0}}>
                        <Center>
                            <Whisper
                                trigger="click"
                                placement="bottomEnd"
                                speaker={
                                    <Popover style={{padding: 0}}>
                                        <div
                                            className="p-4 min-w-[300px] max-h-[400px] overflow-y-auto no-scrollbar"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="font-medium">Select Columns</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {allColumns.map(column => (
                                                    <label key={column.key}
                                                           className="flex items-center gap-2 cursor-pointer">
                                                        <Checkbox
                                                            checked={visibleColumns.some(col => col.key === column.key)}
                                                            onChange={(value, checked) => {
                                                                if (checked) {
                                                                    setVisibleColumns([...visibleColumns, column])
                                                                } else {
                                                                    setVisibleColumns(visibleColumns.filter(col => col.key !== column.key))
                                                                }
                                                            }}
                                                        />
                                                        <span className="text-sm">{column.title}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </Popover>
                                }
                                onClose={() => setHeaderColumnPickerOpen(false)}
                            >
                                <IconButton icon={<CiMenuKebab/>}
                                            appearance={headerColumnPickerOpen ? 'primary' : 'subtle'} size="xs"/>
                            </Whisper>
                        </Center>
                    </HeaderCell>
                    <Cell>
                        {/* Empty cell for column picker header */}
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
                                        <div style={{fontSize: 14, color: '#2eabdf', fontWeight: 'bold'}}>
                                            {(() => {
                                                switch (column.summaryType) {
                                                    case 'sum':
                                                        return `${summary.toLocaleString()}`
                                                    case 'count':
                                                        return `${summary}`
                                                    case 'avg':
                                                        return `${summary.toFixed(2)}`
                                                    case 'min':
                                                        return `${summary.toLocaleString()}`
                                                    case 'max':
                                                        return `${summary.toLocaleString()}`
                                                    default:
                                                        return summary.toLocaleString()
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
                            <Checkbox
                                checked={selectedIds.includes(row.id || row._id)}
                                onChange={(value, checked, event) => {
                                    event?.stopPropagation()
                                    handleSelectRow(row.id || row._id, checked)
                                }}
                            />
                            <div className="flex gap-1">
                                {onEdit && (
                                    <Button size="sm" appearance="subtle" onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(row)
                                    }}>
                                        Edit
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button size="sm" appearance="subtle" onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(row)
                                    }}>
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
                            <Checkbox
                                checked={selectedIds.includes(row.id || row._id)}
                                onChange={(value, checked, event) => {
                                    event?.stopPropagation()
                                    handleSelectRow(row.id || row._id, checked)
                                }}
                            />
                            <div className="flex gap-1">
                                {onEdit && (
                                    <Button size="sm" appearance="subtle" onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(row)
                                    }}>
                                        Edit
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button size="sm" appearance="subtle" onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(row)
                                    }}>
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
            return <div className="text-center py-8 text-muted-foreground">Gantt view requires startDate, endDate, and
                title keys in config</div>
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
                            {Array.from({length: dayRange}, (_, i) => {
                                const date = new Date(minDate)
                                date.setDate(date.getDate() + i)
                                return (
                                    <div key={i} className="flex-1 p-2 text-xs border-r text-center">
                                        {date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
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

            {/* Filter panel */}
            {filterPanelVisible && (
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
                                            onChange={(value) => handleAddPendingFilter(column.key, {
                                                type: 'text',
                                                value,
                                                operator: 'contains'
                                            })}
                                        />
                                        <InputGroup.Button>
                                            <Filter className="h-4 w-4"/>
                                        </InputGroup.Button>
                                    </InputGroup>
                                )}
                                {column.filterType === 'number' && (
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            placeholder="Min"
                                            value={pendingFilters.find(f => f.columnKey === column.key)?.values.find(v => v.operator === 'gte')?.value || ''}
                                            onChange={(value) => handleAddPendingFilter(column.key, {
                                                type: 'number',
                                                value,
                                                operator: 'gte'
                                            })}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Max"
                                            value={pendingFilters.find(f => f.columnKey === column.key)?.values.find(v => v.operator === 'lte')?.value || ''}
                                            onChange={(value) => handleAddPendingFilter(column.key, {
                                                type: 'number',
                                                value,
                                                operator: 'lte'
                                            })}
                                        />
                                    </div>
                                )}
                                {column.filterType === 'date' && (
                                    <DateRangePicker
                                        placeholder="Select date range"
                                        value={pendingFilters.find(f => f.columnKey === column.key)?.values[0]?.value || null}
                                        onChange={(value) => {
                                            if (value && value.length === 2) {
                                                handleAddPendingFilter(column.key, {
                                                    type: 'date',
                                                    value: value,
                                                    operator: 'between'
                                                })
                                            } else if (!value) {
                                                handleAddPendingFilter(column.key, {
                                                    type: 'date',
                                                    value: null,
                                                    operator: 'between'
                                                })
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
                                        onChange={(value) => handleAddPendingFilter(column.key, {
                                            type: 'options',
                                            value
                                        })}
                                        block
                                        cleanable
                                    />
                                )}
                                {column.filterType === 'boolean' && (
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={pendingFilters.find(f => f.columnKey === column.key)?.values[0]?.value === true}
                                            onChange={(checked) => {
                                                handleAddPendingFilter(column.key, {type: 'boolean', value: checked})
                                            }}
                                            checkedChildren="True"
                                            unCheckedChildren="False"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <Divider className="my-6"/>
                    <HStack justifyContent="flex-end" spacing={8}>
                        <Button size="sm" appearance="subtle" onClick={() => setFilterPanelVisible(false)}>
                            Cancel
                        </Button>
                        <Button size="sm" appearance="primary" onClick={handleApplyFilters}>
                            Apply Filters
                        </Button>
                    </HStack>
                </Card>
            )}

            {/* Actions Drawer */}
            <Drawer
                open={currentActionsDrawerOpen}
                onClose={() => setCurrentActionsDrawerOpen(false)}
                placement="right"
                size="200"
            >
                <Drawer.Header>
                    <Drawer.Title>Bulk Actions ({currentSelectedIds.length} selected)</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                    <div className="flex flex-col gap-4">
                        {/* Default Export to Excel action */}
                        <Button
                            appearance="primary"
                            block
                            startIcon={<FileSpreadsheet size={16}/>}
                            onClick={() => {
                                // Export selected to Excel
                                console.log('Export selected to Excel', currentSelectedIds)
                                setCurrentActionsDrawerOpen(false)
                            }}
                        >
                            Export to Excel
                        </Button>

                        {/* Default Delete action */}
                        {onDelete && (
                            <Button
                                appearance="primary"
                                color="red"
                                block
                                startIcon={<Trash2 size={16}/>}
                                onClick={() => {
                                    setConfirmModalConfig({
                                        message: `Delete ${currentSelectedIds.length} selected records?`,
                                        onConfirm: () => {
                                            currentSelectedIds.forEach(id => {
                                                const row = paginatedData.find(r => (r.id || r._id) === id)
                                                if (row) onDelete(row)
                                            })
                                            setCurrentSelectedIds([])
                                            setCurrentActionsDrawerOpen(false)
                                            setConfirmModalOpen(false)
                                        }
                                    })
                                    setConfirmModalOpen(true)
                                }}
                            >
                                Delete Selected
                            </Button>
                        )}

                        {/* Custom bulk actions from config */}
                        {configBulkActions && configBulkActions.length > 0 && (
                            <>
                                <Divider/>
                                <ServerActions
                                    actions={configBulkActions.map(convertToServerAction)}
                                    data={currentSelectedIds.map(id =>
                                        paginatedData.find(r => (r.id || r._id) === id)
                                    ).filter(Boolean)}
                                    context={actionContext}
                                    onActionComplete={(actionKey) => {
                                        setCurrentActionsDrawerOpen(false)
                                    }}
                                    layout="drawer"
                                    block
                                />
                            </>
                        )}
                    </div>
                </Drawer.Body>
                <Drawer.Footer>
                    <Button appearance="subtle" onClick={() => setCurrentActionsDrawerOpen(false)}>
                        Cancel
                    </Button>
                </Drawer.Footer>
            </Drawer>

            {/* Confirmation Modal */}
            <ConfirmationModal
                open={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                config={confirmModalConfig}
            />

            {/* Column picker - kept for backward compatibility but header picker is preferred */}
            {columnPickerVisible && (
                <Card className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {allColumns.map(column => (
                            <label key={column.key} className="flex items-center gap-2 cursor-pointer">
                                <Checkbox
                                    checked={visibleColumns.some(col => col.key === column.key)}
                                    onChange={(value, checked) => {
                                        if (checked) {
                                            setVisibleColumns([...visibleColumns, column])
                                        } else {
                                            setVisibleColumns(visibleColumns.filter(col => col.key !== column.key))
                                        }
                                    }}
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
                <div style={{padding: 20}}>
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
