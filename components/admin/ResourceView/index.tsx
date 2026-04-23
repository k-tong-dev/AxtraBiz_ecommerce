'use client'

import React, { useState, useEffect } from 'react'
import { ListView } from './ListView'
import { KanbanView } from './KanbanView'
import { GanttView } from './GanttView'
import { FormView } from './FormView'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {Input, Drawer, Whisper, Popover, Divider, Loader} from 'rsuite'
import { IconButton } from 'rsuite'
import { Search, Filter, List, Grid3x3, Calendar, Download, Settings, FileSpreadsheet, Trash2 } from 'lucide-react'
import { ResourceViewProps, ResourceType } from './types'
import {InputGroup} from "@/components/ui/input";

export function ResourceView({ config, onEdit, onCreate, onDelete, loading, entityId, initialData }: ResourceViewProps) {
  const [viewType, setViewType] = useState<ResourceType>(config.type)
  const [editingId, setEditingId] = useState<string | undefined>(undefined)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [actionsDrawerOpen, setActionsDrawerOpen] = useState(false)
  const [formInitialData, setFormInitialData] = useState<any>(initialData)
  const [mounted, setMounted] = useState(false)
  
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
      const { getDefaultServerActions } = require('@/components/admin/ResourceView/ServerActions')
      const defaultActions = getDefaultServerActions(config.defaultActions)
      actions = [...defaultActions, ...actions]
    }
    
    return actions
  }, [config.serverActions, config.enableDefaultActions, config.defaultActions])

  const handleEdit = (rowData: any) => {
    setEditingId(rowData.id || rowData._id)
    setViewType('form')
    onEdit?.(rowData)
  }

  const handleCreate = () => {
    setEditingId(undefined)
    setViewType('form')
    onCreate?.()
  }

  const handleFormComplete = () => {
    setEditingId(undefined)
    setViewType(config.type === 'form' ? 'list' : config.type)
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
            onRowClick={handleEdit}
            onEdit={handleEdit}
            onDelete={onDelete}
            loading={loading}
            showFilterPanel={showFilterPanel}
            setShowFilterPanel={setShowFilterPanel}
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            actionsDrawerOpen={actionsDrawerOpen}
            setActionsDrawerOpen={setActionsDrawerOpen}
            serverActions={mergedServerActions}
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
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
          />
        )

      case 'form':
        if (!config.formViewConfig) {
          return <div className="text-center py-8 text-muted-foreground">FormView config not provided</div>
        }
        return (
          <div className="p-4">
            <FormView
              mode={editingId ? 'edit' : 'create'}
              config={config.formViewConfig}
              entityId={editingId}
              initialData={formInitialData}
              serverActions={mergedServerActions}
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
        <div className="flex items-center gap-2">
          {config.listViewConfig && (
            <IconButton 
              icon={<List size={16} />} 
              appearance={viewType === 'list' ? 'primary' : 'subtle'}
              onClick={() => setViewType('list')}
            />
          )}
          {config.kanbanViewConfig && (
            <IconButton 
              icon={<Grid3x3 size={16} />} 
              appearance={viewType === 'kanban' ? 'primary' : 'subtle'}
              onClick={() => setViewType('kanban')}
            />
          )}
          {config.ganttViewConfig && (
            <IconButton 
              icon={<Calendar size={16} />} 
              appearance={viewType === 'gantt' ? 'primary' : 'subtle'}
              onClick={() => setViewType('gantt')}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <InputGroup>
              <InputGroup.Addon>
                <Search className="h-4 w-4" />
              </InputGroup.Addon>
              <Input
                  className="lg:min-w-[400px] md:min-w-[300px] sm:min-w-[200px]"
                  placeholder="Search..."
                  value={searchKeyword}
                  onChange={setSearchKeyword}
                  style={{ width: 200, paddingLeft: 36 }}
              />
            </InputGroup>


          </div>
          <IconButton 
            icon={<Filter size={16} />} 
            appearance={showFilterPanel ? 'primary' : 'subtle'}
            onClick={() => setShowFilterPanel(!showFilterPanel)}
          />
          {selectedIds.length > 0 && (
            <Whisper
              trigger="click"
              placement="bottomEnd"
              speaker={
                <Popover>
                  <div className="flex flex-col gap-2 p-2 min-w-[200px]">
                    {mergedServerActions?.filter(action =>
                        ['print', 'export_excel', 'delete', 'duplicate', 'copy_json', 'archive', 'unarchive'].includes(action.key) &&
                        (action.mode === 'bulk' || action.mode === 'both')
                      )
                      .map((action) => {
                        const handleClick = () => {
                          if (action.key === 'delete') {
                            console.log('Bulk delete:', selectedIds)
                            // TODO: Implement bulk delete
                          } else if (action.key === 'export_excel') {
                            console.log('Export to Excel:', selectedIds)
                            // TODO: Implement Excel export
                          } else if (action.key === 'print') {
                            console.log('Print:', selectedIds)
                            window.print()
                          } else if (action.key === 'duplicate') {
                            console.log('Duplicate:', selectedIds)
                            // TODO: Implement duplication
                          } else if (action.key === 'copy_json') {
                            const selectedData = selectedIds.map(id => {
                              // Find the data from the current view
                              // This would need to be passed from the view
                              return { id }
                            })
                            navigator.clipboard.writeText(JSON.stringify(selectedData, null, 2))
                          } else {
                            action.onClick(selectedIds.map(id => ({ id })), { mode: 'bulk', view: 'list' })
                          }
                        }
                        return (
                          <Button
                            key={action.key}
                            appearance="subtle"
                            block
                            startIcon={action.icon as React.ReactElement}
                            onClick={handleClick}
                          >
                            {action.label}
                          </Button>
                        )
                      })
                    }
                    {(mergedServerActions?.filter(action => !['print', 'export_excel', 'delete', 'duplicate', 'copy_json', 'archive', 'unarchive'].includes(action.key)).length || 0) > 0 && (
                      <>
                        <Divider/>
                        {mergedServerActions?.filter(action => !['print', 'export_excel', 'delete', 'duplicate', 'copy_json', 'archive', 'unarchive'].includes(action.key))
                          .map((action) => (
                            <Button
                              key={action.key}
                              appearance="subtle"
                              block
                              startIcon={action.icon as React.ReactElement}
                              onClick={() => action.onClick(selectedIds.map(id => ({ id })), { mode: 'bulk', view: 'list' })}
                            >
                              {action.label}
                            </Button>
                          ))
                        }
                      </>
                    )}
                  </div>
                </Popover>
              }
            >
              <Button 
                size="sm" 
                appearance="primary"
                startIcon={<Settings size={14} />}
              >
                Actions ({selectedIds.length})
              </Button>
            </Whisper>
          )}
          <Button onClick={handleCreate} size="sm">
            Add New
          </Button>
        </div>
      </div>
    )
  }

  // Show loading state for form view when editing and data is not yet loaded
  if (viewType === 'form' && entityId && !formInitialData && !mounted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Loader backdrop content="Loading..." vertical />
      </div>
    )
  }

  return (
    <Card className="mx-auto max-w-7xl border-border/50 gap-0">
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
    </Card>
  )
}

export * from './types'
