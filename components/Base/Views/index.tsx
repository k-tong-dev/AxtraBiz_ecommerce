'use client'

import React, {useState, useEffect} from 'react'
import {ListView} from './ListView'
import {KanbanView} from './KanbanView'
import {GanttView} from './GanttView'
import {FormView} from './FormView'
import {PrintView} from '../Print/PrintView'
import {Button} from '@/components/ui/button'
import {Card} from '@/components/ui/card'
import {Input, Drawer, Whisper, Popover, Divider, Loader, Tag, Badge} from 'rsuite'
import {IconButton} from 'rsuite'
import {Search as SearchIcon, Filter as FilterIcon, List, Grid3x3, Calendar, Download, Settings, FileSpreadsheet, Trash2} from 'lucide-react'
import {ResourceViewProps, ResourceType} from './types'
import {InputGroup} from "@/components/ui/input";
import {MdAdd} from "react-icons/md";
import {Search as SearchComponent, SearchValue} from '../Search'
import {Filter, FilterValue} from '../Filter'
import {GroupBy} from '../GroupBy'
import {ServerActions} from '../Actions'

export function ResourceView({config, onEdit, onCreate, onDelete, loading, entityId, initialData, recordIds, onNavigate, onRefresh}: ResourceViewProps) {
    const [viewType, setViewType] = useState<ResourceType>(config.type)
    const [editingId, setEditingId] = useState<string | undefined>(undefined)
    const [searchValues, setSearchValues] = useState<SearchValue[]>([])
    const [filterValues, setFilterValues] = useState<FilterValue[]>([])
    const [groupByField, setGroupByField] = useState<string | null>(null)
    const [showFilterPanel, setShowFilterPanel] = useState(false)
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [formInitialData, setFormInitialData] = useState<any>(initialData)
    const [mounted, setMounted] = useState(false)
    const [lastViewType, setLastViewType] = useState<ResourceType>(config.type)
    const [currentFilteredData, setCurrentFilteredData] = useState<any[]>([])
    const [showPrintModal, setShowPrintModal] = useState(false)
    const [printConfig, setPrintConfig] = useState<{data: any[]; mode: 'single' | 'bulk'; title: string; template?: React.ComponentType<any>} | null>(null)

    // Set editingId after mount to avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
        setEditingId(entityId)
    }, [entityId])

    // Sync formInitialData when initialData changes (e.g., after fetch completes)
    useEffect(() => {
        if (initialData) {
            setFormInitialData(initialData)
        }
    }, [initialData])

    // Merge default actions with custom actions
    const mergedServerActions = React.useMemo(() => {
        let actions = config.serverActions || []

        if (config.enableDefaultActions !== false && config.defaultActions) {
            const {getDefaultServerActions} = require('../Actions')
            const defaultActions = getDefaultServerActions(config.defaultActions, config.formViewConfig?.apiEndpoint)
            actions = [...defaultActions, ...actions]
        }

        return actions
    }, [config.serverActions, config.enableDefaultActions, config.defaultActions, config.formViewConfig?.apiEndpoint])

    const handleEdit = (rowData: any) => {
        setLastViewType(viewType)
        setEditingId(rowData.id || rowData._id)
        setViewType('form')
        onEdit?.(rowData)
    }

    const handleRowClick = (rowData: any) => {
        // Just call the external callback without switching to inline form
        // This allows navigation to separate edit page
        console.log('ResourceView handleRowClick rowData:', rowData)
        onEdit?.(rowData)
    }

    const handleCreate = () => {
        setLastViewType(viewType)
        setEditingId(undefined)
        setViewType('form')
        onCreate?.()
    }

    const handleFormComplete = () => {
        setEditingId(undefined)
        setViewType(lastViewType)
    }

    const handlePrint = (data: any[], mode: 'single' | 'bulk', title: string, template?: React.ComponentType<any>) => {
        try {
            // Ensure title is never empty
            const safeTitle = title && typeof title === 'string' && title.trim() ? title : 'Print'
            // Convert empty string values to null instead of filtering them out
            const safeData = data.map(item => 
                Object.fromEntries(
                    Object.entries(item || {}).map(([key, value]) => [key, value === '' ? null : value])
                )
            )
            setPrintConfig({data: safeData, mode, title: safeTitle, template})
            setShowPrintModal(true)
        } catch (e) {
            console.error('Error in handlePrint:', e)
        }
    }

    const handlePrintClose = () => {
        setShowPrintModal(false)
        setPrintConfig(null)
    }

    const handleExport = () => {
        // Export functionality
        console.log('Export triggered')
    }

    const renderView = () => {
        switch (viewType) {
            case 'list':
                if (!config.listViewConfig) {
                    return <div className="text-center py-8 text-muted-foreground">ListView config not provided</div>
                }
                return (
                    <ListView
                        config={config.listViewConfig}
                        onRowClick={handleRowClick}
                        onEdit={handleEdit}
                        onDelete={onDelete}
                        loading={loading}
                        searchValues={searchValues}
                        filterValues={filterValues}
                        groupByField={groupByField}
                        selectedIds={selectedIds}
                        setSelectedIds={setSelectedIds}
                        serverActions={mergedServerActions}
                        availableFields={config.listViewConfig?.columns?.map(col => ({
                            key: col.key,
                            label: col.title,
                            type: col.type
                        })) || []}
                        onDataChange={setCurrentFilteredData}
                    />
                )

            case 'kanban':
                if (!config.kanbanViewConfig) {
                    return <div className="text-center py-8 text-muted-foreground">KanbanView config not provided</div>
                }
                return (
                    <KanbanView
                        config={config.kanbanViewConfig}
                        loading={loading}
                        showFilterPanel={showFilterPanel}
                        setShowFilterPanel={setShowFilterPanel}
                        searchKeyword={searchValues.map(v => v.value).join(' ')}
                        setSearchKeyword={() => {}}
                        filterValues={filterValues}
                        groupByField={groupByField || undefined}
                        onCardClick={handleRowClick}
                        onCardEdit={handleEdit}
                    />
                )

            case 'form':
                if (!config.formViewConfig) {
                    return <div className="text-center py-8 text-muted-foreground">FormView config not provided</div>
                }
                return (
                    <div className="">
                        <FormView
                            mode={editingId ? 'edit' : 'create'}
                            config={config.formViewConfig}
                            entityId={editingId}
                            initialData={formInitialData}
                            serverActions={mergedServerActions}
                            onPrint={handlePrint}
                            availableFields={config.formViewConfig?.fields?.map(f => ({
                                key: f.key,
                                label: f.label,
                                type: f.type
                            })) || []}
                            recordIds={recordIds}
                            onNavigate={onNavigate}
                            onRefresh={onRefresh}
                        />
                    </div>
                )

            case 'gantt':
                if (!config.ganttViewConfig) {
                    return <div className="text-center py-8 text-muted-foreground">GanttView config not provided</div>
                }
                return (
                    <GanttView
                        config={config.ganttViewConfig}
                        loading={loading}
                    />
                )

            default:
                return <div className="text-center py-8 text-muted-foreground">Unknown view type</div>
        }
    }

    const renderHeader = () => {
        if (viewType === 'form') return null

        return (
            <div className="flex items-center justify-between gap-4 px-6 pt-2">
                <div className="flex items-center gap-1 p-1 rounded-sm">
                    {config.listViewConfig && (
                        <IconButton
                            color={"violet"}
                            size={"sm"}
                            icon={<List size={16}/>}
                            appearance={viewType === 'list' ? 'primary' : 'subtle'}
                            onClick={() => setViewType('list')}
                        />
                    )}
                    {config.kanbanViewConfig && (
                        <IconButton
                            color={"violet"}
                            size={"sm"}
                            icon={<Grid3x3 size={16}/>}
                            appearance={viewType === 'kanban' ? 'primary' : 'subtle'}
                            onClick={() => setViewType('kanban')}
                        />
                    )}
                    {config.ganttViewConfig && (
                        <IconButton
                            color={"violet"}
                            size={"sm"}
                            icon={<Calendar size={16}/>}
                            appearance={viewType === 'gantt' ? 'primary' : 'subtle'}
                            onClick={() => setViewType('gantt')}
                        />
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <SearchComponent
                        fields={config.listViewConfig?.columns
                            .map(col => ({
                                key: col.key,
                                label: col.title,
                                type: 'text'
                            })) || []}
                        onSearchChange={setSearchValues}
                        placeholder="Search..."
                        width={400}
                    />
                    <Filter
                        fields={config.listViewConfig?.columns
                            .filter(col => col.filterable !== false)
                            .map(col => ({
                                key: col.key,
                                label: col.title,
                                type: col.type || 'text',
                                options: col.filterOptions
                            })) || []}
                        value={filterValues}
                        onChange={setFilterValues}
                    />
                    <GroupBy
                        fields={config.listViewConfig?.columns
                            .filter(col => col.groupable !== false)
                            .map(col => ({
                                key: col.key,
                                label: col.title
                            })) || []}
                        value={groupByField}
                        onChange={setGroupByField}
                    />
                    {selectedIds.length > 0 && (
                        <ServerActions
                            actions={mergedServerActions}
                            data={currentFilteredData.filter(item => 
                                selectedIds.includes(item.id || item._id)
                            ) || []}
                            context={{
                                mode: 'bulk',
                                view: 'list',
                                selectedIds,
                                apiEndpoint: config.formViewConfig?.apiEndpoint,
                                refresh: onRefresh,
                            }}
                            layout="dropdown"
                            onPrint={handlePrint}
                            availableFields={config.listViewConfig?.columns?.map(col => ({
                                key: col.key,
                                label: col.title,
                                type: col.type
                            })) || []}
                        />
                    )}
                    <Button onClick={handleCreate}
                            color="violet"
                            startIcon={<MdAdd />}
                            appearance={"primary"}
                            size="sm">
                        New
                    </Button>
                </div>
            </div>
        )
    }

    // Show loading state for form view when editing and data is not yet loaded
    if (viewType === 'form' && entityId && !formInitialData && mounted) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Loader backdrop content="Loading..." vertical/>
            </div>
        )
    }

    return (
        <Card className="mx-auto max-w-7xl border-border/50 gap-0 rounded-none min-h-screen">
            {config.title && (
                <div className="px-6 pt-1">
                    <h1 className="text-2xl font-bold">{config.title}</h1>
                    {config.description && (
                        <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
                    )}
                </div>
            )}
            <div className="p-6 pt-0">
                {renderHeader()}
                {renderView()}
            </div>
            {showPrintModal && printConfig && (
                <PrintView
                    open={showPrintModal}
                    data={printConfig.data}
                    mode={printConfig.mode}
                    title={printConfig.title}
                    template={printConfig.template}
                    onClose={handlePrintClose}
                />
            )}
        </Card>
    )
}

export * from './types'
