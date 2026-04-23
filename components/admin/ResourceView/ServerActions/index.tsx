'use client'

import React, {useState} from 'react'
import {Button, Modal, Popover, Whisper} from 'rsuite'
import {cn} from '@/lib/utils'

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
