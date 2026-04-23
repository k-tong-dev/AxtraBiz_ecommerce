'use client'

import React, { useState } from 'react'
import { ListView } from './ListView'
import { KanbanView } from './KanbanView'
import { GanttView } from './GanttView'
import { FormView } from './FormView'
import { Button } from '@/components/ui/button'
import { Input, Drawer } from 'rsuite'
import { IconButton } from 'rsuite'
import { Search, Filter, List, Grid3x3, Calendar, Download, Settings, FileSpreadsheet, Trash2 } from 'lucide-react'
import { ResourceViewProps, ResourceType } from './types'
import {InputGroup} from "@/components/ui/input";

export function ResourceView({ config, onEdit, onCreate, onDelete, loading }: ResourceViewProps) {
  const [viewType, setViewType] = useState<ResourceType>(config.type)
  const [editingId, setEditingId] = useState<string | undefined>(undefined)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [actionsDrawerOpen, setActionsDrawerOpen] = useState(false)

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
            />
            <div className="mt-4 flex gap-2">
              <Button onClick={handleFormComplete}>Back to List</Button>
            </div>
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
            <Button 
              size="sm" 
              appearance="primary"
              startIcon={<Settings size={14} />}
              onClick={() => setActionsDrawerOpen(true)}
            >
              Actions ({selectedIds.length})
            </Button>
          )}
          <Button onClick={handleCreate} size="sm">
            Add New
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      {renderHeader()}
      {renderView()}
    </div>
  )
}

export * from './types'
