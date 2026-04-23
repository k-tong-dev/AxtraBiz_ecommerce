'use client'

import React, {useState} from 'react'
import {Button, Modal, Popover, Whisper} from 'rsuite'
import {cn} from '@/lib/utils'
import {Printer, FileSpreadsheet, Trash2, Copy, Download, Archive, ArchiveRestore} from 'lucide-react'
import {createElement} from 'react'

// Built-in default ServerActions - generic utility that can be used by any resource
export const getDefaultServerActions = (flags: {
    print?: boolean
    exportExcel?: boolean
    delete?: boolean
    duplicate?: boolean
    copyJson?: boolean
    archive?: boolean
    unarchive?: boolean
} = {}): ServerActionConfig[] => {
    const actions: ServerActionConfig[] = []
    
    if (flags.print !== false) {
        actions.push({
            key: 'print',
            label: 'Print',
            icon: createElement(Printer, {size: 16}),
            color: 'blue',
            mode: 'both',
            helper: 'Print this record',
            onClick: async (data, context) => {
                window.print()
            }
        })
    }
    
    if (flags.exportExcel !== false) {
        actions.push({
            key: 'export_excel',
            label: 'Export Excel',
            icon: createElement(FileSpreadsheet, {size: 16}),
            color: 'green',
            mode: 'bulk',
            helper: 'Export selected records to Excel',
            onClick: async (data, context) => {
                if (context?.mode === 'bulk') {
                    const ids = context.selectedIds || data.map(d => d.id)
                    console.log('Export to Excel:', ids)
                    // TODO: Implement Excel export
                }
            }
        })
    }
    
    if (flags.delete !== false) {
        actions.push({
            key: 'delete',
            label: 'Delete',
            icon: createElement(Trash2, {size: 16}),
            color: 'red',
            mode: 'both',
            confirm: (data, context) => {
                if (context?.mode === 'bulk') {
                    return `Delete ${context.selectedIds?.length || data.length} record(s)? This action cannot be undone.`
                } else {
                    return 'Delete this record? This action cannot be undone.'
                }
            },
            helper: 'Permanently remove record(s)',
            onClick: async (data, context) => {
                if (context?.mode === 'bulk') {
                    const ids = context.selectedIds || data.map(d => d.id)
                    console.log('Bulk delete:', ids)
                    // TODO: Implement bulk delete API call
                } else {
                    const id = context?.record?.id || data[0]?.id
                    console.log('Delete:', id)
                    // TODO: Implement delete API call
                }
            }
        })
    }
    
    if (flags.duplicate !== false) {
        actions.push({
            key: 'duplicate',
            label: 'Duplicate',
            icon: createElement(Copy, {size: 16}),
            color: 'blue',
            mode: 'both',
            helper: 'Create a copy of this record',
            onClick: async (data, context) => {
                const record = context?.record || data[0]
                console.log('Duplicate:', record)
                // TODO: Implement duplication logic
            }
        })
    }
    
    if (flags.copyJson !== false) {
        actions.push({
            key: 'copy_json',
            label: 'Copy JSON',
            icon: createElement(Download, {size: 16}),
            color: 'blue',
            mode: 'both',
            helper: 'Copy record data as JSON',
            onClick: async (data, context) => {
                const record = context?.record || data[0]
                const json = JSON.stringify(record, null, 2)
                navigator.clipboard.writeText(json)
                console.log('Copied to clipboard')
            }
        })
    }
    
    if (flags.archive !== false) {
        actions.push({
            key: 'archive',
            label: 'Archive',
            icon: createElement(Archive, {size: 16}),
            color: 'orange',
            mode: 'both',
            helper: 'Archive this record',
            onClick: async (data, context) => {
                const id = context?.record?.id || data[0]?.id
                console.log('Archive:', id)
                // TODO: Implement archive logic
            }
        })
    }
    
    if (flags.unarchive !== false) {
        actions.push({
            key: 'unarchive',
            label: 'Unarchive',
            icon: createElement(ArchiveRestore, {size: 16}),
            color: 'green',
            mode: 'both',
            helper: 'Unarchive this record',
            onClick: async (data, context) => {
                const id = context?.record?.id || data[0]?.id
                console.log('Unarchive:', id)
                // TODO: Implement unarchive logic
            }
        })
    }
    
    return actions
}

export interface ServerActionConfig {
    label: string
    key: string
    icon?: React.ReactNode
    color?: 'blue' | 'green' | 'red' | 'orange' | 'violet' | 'yellow' | 'cyan'
    variant?: 'default' | 'primary' | 'danger' | 'success' | 'warning' | 'info'
    onClick: (data: any[], context?: ActionContext) => void | Promise<void>
    show?: (data: any[], context?: ActionContext) => boolean
    confirm?: string | ((data: any[], context?: ActionContext) => string)
    helper?: string
    mode?: 'create' | 'edit' | 'both' | 'bulk'
    readonly?: boolean
    badge?: string | number
    className?: string
}

/**
 * ActionContext provides information about the context in which an action is executed.
 * 
 * For ListView (bulk mode):
 * - mode: 'bulk'
 * - view: 'list'
 * - selectedIds: Array of selected record IDs
 * - record: undefined
 * - data: Array of selected records
 * 
 * For FormView (single mode):
 * - mode: 'single'
 * - view: 'form'
 * - selectedIds: undefined
 * - record: Single record object
 * - data: Array with single record [record]
 * 
 * Example action that works in both contexts:
 * ```typescript
 * const deleteAction: ServerActionConfig = {
 *   key: 'delete',
 *   label: 'Delete',
 *   onClick: (data, context) => {
 *     if (context.mode === 'bulk') {
 *       // ListView: delete multiple records
 *       const ids = context.selectedIds || data.map(d => d.id)
 *       deleteRecords(ids)
 *     } else {
 *       // FormView: delete single record
 *       const id = context.record?.id || data[0]?.id
 *       deleteRecord(id)
 *     }
 *   }
 * }
 * ```
 */

export interface ActionContext {
    mode: 'bulk' | 'single'
    view: 'list' | 'form'
    record?: any
    selectedIds?: string[]
}

export interface ServerActionsProps {
    actions: ServerActionConfig[]
    data: any[]
    context: ActionContext
    onActionComplete?: (actionKey: string) => void
    layout?: 'dropdown' | 'drawer' | 'toolbar' | 'inline'
    block?: boolean
    size?: 'xs' | 'sm' | 'md' | 'lg'
}

export function ServerActions({
    actions,
    data,
    context,
    onActionComplete,
    layout = 'inline',
    block = false,
    size = 'sm'
}: ServerActionsProps) {
    const [confirmModalOpen, setConfirmModalOpen] = useState(false)
    const [confirmModalConfig, setConfirmModalConfig] = useState<{
        message: string
        onConfirm: () => void | Promise<void>
    } | null>(null)
    const [loading, setLoading] = useState<string | null>(null)

    const handleActionClick = async (action: ServerActionConfig) => {
        // Check if action should be shown
        if (action.show && !action.show(data, context)) {
            return
        }

        // Handle confirmation
        let confirmMessage: string
        if (typeof action.confirm === 'function') {
            confirmMessage = action.confirm(data, context)
        } else if (typeof action.confirm === 'string') {
            confirmMessage = action.confirm
        } else {
            confirmMessage = ''
        }

        if (confirmMessage) {
            setConfirmModalConfig({
                message: confirmMessage,
                onConfirm: async () => {
                    setLoading(action.key)
                    try {
                        await action.onClick(data, context)
                        if (onActionComplete) {
                            onActionComplete(action.key)
                        }
                    } finally {
                        setLoading(null)
                        setConfirmModalOpen(false)
                    }
                }
            })
            setConfirmModalOpen(true)
        } else {
            setLoading(action.key)
            try {
                await action.onClick(data, context)
                if (onActionComplete) {
                    onActionComplete(action.key)
                }
            } finally {
                setLoading(null)
            }
        }
    }

    const renderButton = (action: ServerActionConfig) => {
        // Check mode filter
        if (action.mode && action.mode !== 'both') {
            if (context.mode === 'bulk' && action.mode !== 'bulk') return null
            if (context.mode === 'single') {
                // For single mode, check if action mode matches the form mode (create/edit)
                if (context.view === 'form' && action.mode !== 'create' && action.mode !== 'edit') return null
            }
        }

        // Check show condition
        if (action.show && !action.show(data, context)) {
            return null
        }

        const button = (
            <Button
                key={action.key}
                appearance={action.variant === 'default' ? 'subtle' : action.variant === 'primary' ? 'primary' : 'ghost'}
                color={action.color || 'blue'}
                block={block}
                size={size}
                startIcon={action.icon}
                onClick={() => handleActionClick(action)}
                disabled={loading === action.key || action.readonly}
                loading={loading === action.key}
                className={cn(action.className)}
            >
                {action.label}
                {action.badge && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
            {action.badge}
          </span>
                )}
            </Button>
        )

        // Wrap with Whisper if helper text is provided
        if (action.helper) {
            return (
                <Whisper
                    key={action.key}
                    trigger="hover"
                    placement="bottom"
                    speaker={<Popover>{action.helper}</Popover>}
                >
                    {button}
                </Whisper>
            )
        }

        return button
    }

    const renderActions = () => {
        return actions.map(action => renderButton(action))
    }

    if (layout === 'inline') {
        return (
            <div className="flex flex-col gap-2">
                {renderActions()}
            </div>
        )
    }

    if (layout === 'toolbar') {
        return (
            <div className="flex gap-2">
                {renderActions()}
            </div>
        )
    }

    if (layout === 'drawer') {
        return (
            <div className="flex flex-col gap-4">
                {renderActions()}
            </div>
        )
    }

    // Default inline layout
    return (
        <div className="flex flex-col gap-2">
            {renderActions()}
        </div>
    )
}

// Confirmation Modal
export function ConfirmationModal({
    open,
    onClose,
    config
}: {
    open: boolean
    onClose: () => void
    config: { message: string; onConfirm: () => void | Promise<void> } | null
}) {
    const [loading, setLoading] = useState(false)

    const handleConfirm = async () => {
        if (!config) return
        setLoading(true)
        try {
            await config.onConfirm()
            onClose()
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            size="sm"
        >
            <Modal.Header>
                <Modal.Title>Confirm Action</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {config?.message}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onClose} appearance="subtle" disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    appearance="primary"
                    color="red"
                    loading={loading}
                >
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
