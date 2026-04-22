'use client'

import { ListViewConfig } from './ListView'
import { KanbanViewConfig } from './KanbanView'
import { GanttViewConfig } from './GanttView'
import { FormConfig } from './FormView'

export type ResourceType = 'list' | 'kanban' | 'gantt' | 'form'

export interface ResourceViewConfig {
  type: ResourceType
  listViewConfig?: ListViewConfig
  kanbanViewConfig?: KanbanViewConfig
  ganttViewConfig?: GanttViewConfig
  formViewConfig?: FormConfig
}

export interface ResourceViewProps {
  config: ResourceViewConfig
  onEdit?: (rowData: any) => void
  onCreate?: () => void
  onDelete?: (rowData: any) => void
  loading?: boolean
}
