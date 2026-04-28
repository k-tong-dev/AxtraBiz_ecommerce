'use client'

import {useState, useEffect} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import {Breadcrumb, Dropdown, Loader, Popover, Whisper, Drawer} from 'rsuite'
import {uploadFile, deleteFile, fetchAttachmentUrls} from '@/lib/utils/file-upload'
import {
    ActionBar,
    ActionBarItem,
    ActionBarGroup,
    ActionBarSeparator,
    ActionBarSelection,
    ActionBarClose
} from '@/components/ui/action-bar'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import {SelectPicker} from 'rsuite'
import {Save, Printer, Settings, Copy, Trash2, Archive, Upload, X, Plus} from 'lucide-react'
import {useToast} from '@/hooks/use-toast'
import {IoMdCloudDone, IoMdSettings, IoMdArrowBack} from "react-icons/io";
import {BsTools} from "react-icons/bs";
import {DatePickerField} from '@/components/admin/DatePickerField'
import {ServerActions, ServerActionConfig, ActionContext} from '../ServerActions'

// Convert FormView customActions to ServerActionConfig
function convertFormActionToServerAction(action: any, mode: 'create' | 'edit'): ServerActionConfig {
    return {
        key: action.key,
        label: action.label,
        icon: typeof action.icon === 'function' ? action.icon() : action.icon,
        color: action.variant === 'danger' ? 'red' : 
                action.variant === 'success' ? 'green' :
                action.variant === 'warning' ? 'orange' :
                action.variant === 'info' ? 'blue' : undefined,
        variant: action.variant || 'default',
        onClick: (data, context) => {
            action.onClick(data[0]) // FormView passes single record
        },
        show: action.show ? (data, context) => action.show(data[0]) : undefined,
        confirm: action.confirm,
        helper: action.helper,
        mode: action.mode || 'both',
        readonly: action.readonly,
        badge: action.badge,
        className: action.className
    }
}

// Convert FormView built-in actions to ServerActionConfig
function convertBuiltInActionsToServerActions(config: FormConfig, mode: 'create' | 'edit', handlers: {
    handlePrint: () => void
    handleExport: () => void
    handleDuplicate: () => void
    handleCopy: () => void
    handleDelete: () => void
    handleArchive: () => void
}): ServerActionConfig[] {
    const actions: ServerActionConfig[] = []
    
    if (config.actions?.print) {
        actions.push({
            key: 'print',
            label: 'Print',
            icon: <Printer size={16} />,
            color: 'blue',
            mode: 'both',
            helper: 'Print this record',
            onClick: () => handlers.handlePrint()
        })
    }
    
    if (config.actions?.export) {
        actions.push({
            key: 'export',
            label: 'Export',
            icon: <Settings size={16} />,
            color: 'blue',
            mode: 'both',
            helper: 'Export this record',
            onClick: () => handlers.handleExport()
        })
    }
    
    if (mode === 'edit' && config.actions?.duplicate) {
        actions.push({
            key: 'duplicate',
            label: 'Duplicate',
            icon: <Copy size={16} />,
            color: 'blue',
            mode: 'edit',
            helper: 'Create a copy of this record',
            onClick: () => handlers.handleDuplicate()
        })
    }
    
    if (config.actions?.copy) {
        actions.push({
            key: 'copy',
            label: 'Copy to Clipboard',
            icon: <Copy size={16} />,
            color: 'blue',
            mode: 'both',
            helper: 'Copy record data to clipboard',
            onClick: () => handlers.handleCopy()
        })
    }
    
    if (mode === 'edit' && config.actions?.archive) {
        actions.push({
            key: 'archive',
            label: 'Archive',
            icon: <Archive size={16} />,
            color: 'orange',
            mode: 'edit',
            helper: 'Archive this record',
            onClick: () => handlers.handleArchive()
        })
    }
    
    if (mode === 'edit' && config.actions?.delete) {
        actions.push({
            key: 'delete',
            label: 'Delete',
            icon: <Trash2 size={16} />,
            color: 'red',
            mode: 'edit',
            confirm: 'Delete this record? This action cannot be undone.',
            helper: 'Permanently remove this record',
            onClick: () => handlers.handleDelete()
        })
    }
    
    return actions
}

// Generic field types for the FormView
export interface FormField {
    key: string
    label: string
    type: 'text' | 'textarea' | 'number' | 'select' | 'file' | 'array' | 'json' | 'checkbox' | 'boolean' | 'toggle' | 'date' | 'datetime'
    required?: boolean
    readonly?: boolean
    helper?: string
    placeholder?: string
    options?: Array<{ label: string; value: string }>
    validation?: (value: any) => string | null
    className?: string
    gridCols?: number
    rows?: number
    accept?: string
    width?: string
    icon?: React.ReactNode
    uploadText?: string
    order?: number
    after?: string
    before?: string
    gridRow?: number
    gridColumn?: number
}

// Custom page configuration for form pages (like Odoo)
export interface FormPage {
    key: string
    label: string
    component: React.ComponentType<{data: any; onDataChange: (data: any) => void}>
    show?: (data: any) => boolean
    order?: number
}

// Form configuration for different entities
export interface FormConfig {
    entityName: string
    entityNamePlural: string
    apiEndpoint: string
    fields: FormField[]
    customPages?: FormPage[]  // Custom pages with components (like Odoo)
    actions?: {  // Made optional - now using centralized serverActions from ResourceView
        print?: boolean
        export?: boolean
        duplicate?: boolean
        copy?: boolean
        archive?: boolean
        delete?: boolean
    }
    customActions?: Array<{
        key: string
        label: string
        icon?: React.ReactNode | (() => React.ReactNode)
        onClick: (data: any) => void
        mode?: 'create' | 'edit' | 'both'
        variant?: 'default' | 'primary' | 'danger' | 'success' | 'warning' | 'info'
        className?: string
        badge?: string | number
        readonly?: boolean
        helper?: string
    }>
    breadcrumbs: {
        base: string
        list: string
        create: string
        edit: string
    }
}

// Generic entity type
export interface Entity {
    id?: string

    [key: string]: any
}

// Mutable entity type for form state
export type MutableEntity = {
    [key: string]: any
}

interface FormViewProps<T extends Entity> {
    mode: 'create' | 'edit'
    config: FormConfig
    initialData?: T | null
    entityId?: string
    serverActions?: ServerActionConfig[]  // Centralized ServerActions from ResourceView
    availableFields?: Array<{ key: string; label: string; type?: string }>
    onPrint?: (data: any[], mode: 'single' | 'bulk', title: string, template?: React.ComponentType<any>) => void
}

export function FormView<T extends Entity>({mode, config, initialData, entityId, serverActions, availableFields = [], onPrint}: FormViewProps<T>) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const {toast} = useToast()

    const [data, setData] = useState<MutableEntity>({} as MutableEntity)
    const [originalData, setOriginalData] = useState<MutableEntity | null>(null)
    const [hasChanges, setHasChanges] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState<Array<{id: string, url: string, file?: File}>>([])
    const [showQuickActions, setShowQuickActions] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [actionContext, setActionContext] = useState<ActionContext>({
        mode: 'single',
        view: 'form',
        record: data
    })

    useEffect(() => {
        setActionContext(prev => ({
            ...prev,
            record: data
        }))
    }, [data])

    useEffect(() => {
        setMounted(true)
    }, [])

    // Initialize form data
    useEffect(() => {
        // Check for duplicate data in URL params (context system)
        const duplicateParam = searchParams.get('duplicate')
        
        
        if (mode === 'edit' && initialData) {
            setData(initialData as MutableEntity)
            setOriginalData(initialData as MutableEntity)
            // Initialize uploadedFiles from existing file fields
            const existingFileIds = config.fields
                .filter(f => f.type === 'file' && initialData[f.key])
                .flatMap(f => Array.isArray(initialData[f.key]) ? initialData[f.key] : [initialData[f.key]])
            // Fetch URLs from ir_attachment table
            if (existingFileIds.length > 0) {
                fetchAttachmentUrls(existingFileIds)
                    .then(attachments => {
                        // If fetch returns empty but we have IDs, create entries with empty URLs
                        if (attachments.length === 0 && existingFileIds.length > 0) {
                            setUploadedFiles(existingFileIds.map(id => ({id, url: ''})))
                        } else {
                            setUploadedFiles(attachments)
                        }
                        setLoading(false)
                    })
                    .catch(error => {
                        console.error('Failed to fetch attachment URLs:', error)
                        // Fallback to empty URLs
                        setUploadedFiles(existingFileIds.map(id => ({id, url: ''})))
                        setLoading(false)
                    })
            } else {
                setUploadedFiles([])
                setLoading(false)
            }
        } else if (mode === 'create') {
            // Initialize with default values
            let defaultData: MutableEntity = {} as MutableEntity
            let isDuplicate = false
            
            // If duplicate data exists in URL, use it as base
            if (duplicateParam) {
                try {
                    const duplicateData = JSON.parse(decodeURIComponent(duplicateParam))
                    defaultData = duplicateData as MutableEntity
                    // Clear ID to ensure it's treated as new
                    delete defaultData.id
                    isDuplicate = true
                } catch (error) {
                    console.error('Error parsing duplicate data:', error)
                }
            }
            
            // Initialize missing fields with defaults
            config.fields.forEach(field => {
                if (defaultData[field.key] === undefined || defaultData[field.key] === null) {
                    if (field.type === 'array' || field.type === 'json') {
                        defaultData[field.key] = []
                    } else if (field.type === 'number') {
                        defaultData[field.key] = 0
                    } else if (field.type === 'toggle' || field.type === 'boolean' || field.type === 'checkbox') {
                        defaultData[field.key] = false
                    } else {
                        defaultData[field.key] = ''
                    }
                }
            })
            
            setData(defaultData)
            
            // When duplicating, don't set originalData so hasChanges remains true
            if (!isDuplicate) {
                setOriginalData(defaultData)
            } else {
                setOriginalData({} as MutableEntity) // Empty object to ensure hasChanges stays true
                setHasChanges(true)
            }
            
            setLoading(false)
        }
    }, [mode, initialData, config.fields, searchParams])

    // Check if form is valid (all required fields filled)
    const isFormValid = () => {
        for (const field of config.fields) {
            const value = data[field.key]
            
            // Only check if required field is missing or empty string
            if (field.required) {
                if (value === undefined || value === null || value === '') {
                    return false
                }
            }
            
            // Only run validation if field has a value and is not empty
            if (field.validation && value !== undefined && value !== null && value !== '') {
                const error = field.validation(value)
                if (error) {
                    return false
                }
            }
        }
        return true
    }

    // Track changes
    useEffect(() => {
        if (!originalData || !data) return

        // Check if there are new files (files without IDs)
        const hasNewFiles = uploadedFiles.some(f => f.file && !f.id)

        // Get current file IDs from uploadedFiles state
        const currentFileIds = uploadedFiles.map(f => f.id).filter(id => id).sort()

        // Get original file IDs from originalData for all file fields
        let originalFileIds: string[] = []
        for (const field of config.fields) {
            if (field.type === 'file' && originalData[field.key]) {
                const fieldIds = Array.isArray(originalData[field.key])
                    ? originalData[field.key]
                    : [originalData[field.key]]
                originalFileIds = [...originalFileIds, ...fieldIds.filter((id: string) => id)]
            }
        }
        originalFileIds = originalFileIds.sort()

        // Files are different if IDs don't match or there are new files
        const filesChanged = JSON.stringify(currentFileIds) !== JSON.stringify(originalFileIds) || hasNewFiles

        // Check if any non-file data changed
        const dataWithoutFiles = {...data}
        const originalWithoutFiles = {...originalData}
        for (const field of config.fields) {
            if (field.type === 'file') {
                delete dataWithoutFiles[field.key]
                delete originalWithoutFiles[field.key]
            }
        }
        const dataChanged = JSON.stringify(dataWithoutFiles) !== JSON.stringify(originalWithoutFiles)

        const isChanged = dataChanged || filesChanged


        setHasChanges(isChanged)
    }, [data, originalData, uploadedFiles, config.fields])

    const handleSubmit = async () => {
        // Validate required fields
        for (const field of config.fields) {
            if (field.required && !data[field.key]) {
                toast({
                    title: 'Validation Error',
                    description: `${field.label} is required`,
                    variant: 'destructive'
                })
                return
            }

            if (field.validation) {
                const error = field.validation(data[field.key])
                if (error) {
                    toast({
                        title: 'Validation Error',
                        description: error,
                        variant: 'destructive'
                    })
                    return
                }
            }
        }

        setSaving(true)

        try {
            const payload = {...data}

            // Upload new files to storage first
            const newFiles = uploadedFiles.filter(f => f.file && !f.id)
            // Track original file IDs to detect deleted attachments
            const originalFileIds: string[] = []
            if (originalData) {
                for (const field of config.fields) {
                    if (field.type === 'file' && originalData[field.key]) {
                        const fieldIds = Array.isArray(originalData[field.key])
                            ? originalData[field.key]
                            : [originalData[field.key]]
                        originalFileIds.push(...fieldIds.filter((id: string) => id))
                    }
                }
            }

            if (newFiles.length > 0) {
                try {
                    const uploadPromises = newFiles.map(f => uploadFile(f.file!, {
                        res_model: 'products',
                        res_id: entityId || ''
                    }))
                    const results = await Promise.all(uploadPromises)
                    // Update uploadedFiles with the uploaded file IDs and URLs (remove file property)
                    const uploadedFilesMap = new Map(newFiles.map((f, i) => [f.url, results[i]]))
                    setUploadedFiles(prev => prev.map(f => {
                        const uploaded = uploadedFilesMap.get(f.url)
                        return uploaded ? {id: uploaded.id, url: uploaded.url} : f
                    }))
                    // Update payload with all file IDs (existing + newly uploaded)
                    const allFileIds = uploadedFiles.map(f => {
                        const uploaded = uploadedFilesMap.get(f.url)
                        return uploaded ? uploaded.id : f.id
                    }).filter(id => id)
                    config.fields
                        .filter(f => f.type === 'file')
                        .forEach(field => {
                            if (allFileIds.length > 0) {
                                payload[field.key] = allFileIds
                            }
                        })
                } catch (error) {
                    toast({
                        title: 'Upload Error',
                        description: error instanceof Error ? error.message : 'Failed to upload files',
                        variant: 'destructive'
                    })
                    setSaving(false)
                    return
                }
            } else {
                // Only existing files, just use their IDs and remove file property
                setUploadedFiles(prev => prev.map(f => ({id: f.id, url: f.url})))
                config.fields
                    .filter(f => f.type === 'file')
                    .forEach(field => {
                        const fileIds = uploadedFiles.map(f => f.id).filter(id => id)
                        if (fileIds.length > 0) {
                            payload[field.key] = fileIds
                        }
                    })
            }

            // Delete attachments that were removed from the UI
            const currentFileIds = uploadedFiles.map(f => f.id).filter(id => id)
            const deletedIds = originalFileIds.filter(id => !currentFileIds.includes(id))
            if (deletedIds.length > 0) {
                for (const id of deletedIds) {
                    try {
                        await deleteFile(id)
                    } catch (error) {
                        console.error('Failed to delete attachment:', id, error)
                    }
                }
            }

            // Remove ID for create mode
            if (mode === 'create' && payload.id) {
                delete payload.id
            }

            const endpoint = mode === 'edit' && entityId ? `${config.apiEndpoint}/${entityId}` : config.apiEndpoint
            const method = mode === 'edit' ? 'PUT' : 'POST'

            const response = await fetch(endpoint, {
                method: method,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            })

            const result = await response.json()

            if (!response.ok) {
                // Handle HTTP errors
                toast({
                    title: 'Error',
                    description: `HTTP ${response.status}: ${result.error || result.message || 'Failed to save'}`,
                    variant: 'destructive'
                })
                return
            }

            if (result.success) {
                if (mode === 'create') {
                    toast({
                        title: `${config.entityName} Created`,
                        description: `${config.entityName} has been successfully created`
                    })
                    router.push(config.breadcrumbs.list)
                } else {
                    toast({
                        title: `${config.entityName} Updated`,
                        description: `${config.entityName} has been successfully updated`
                    })
                    // Use server response data to update originalData (it has the saved file IDs)
                    const serverData = result.data || data
                    // Get file IDs from server response for all file fields
                    const serverFileIds: string[] = []
                    for (const field of config.fields) {
                        if (field.type === 'file' && serverData[field.key]) {
                            const fieldIds = Array.isArray(serverData[field.key])
                                ? serverData[field.key]
                                : [serverData[field.key]]
                            serverFileIds.push(...fieldIds.filter((id: string) => id))
                        }
                    }
                    // Fetch attachment URLs for the server file IDs
                    if (serverFileIds.length > 0) {
                        fetchAttachmentUrls(serverFileIds)
                            .then(attachments => {
                                // Use the fetched attachments (which actually exist) for uploadedFiles
                                setUploadedFiles(attachments)
                                // Update originalData with the actual attachment IDs that exist
                                const actualFileIds = attachments.map(a => a.id)
                                const updatedServerData = {
                                    ...serverData,
                                    ...config.fields
                                        .filter(f => f.type === 'file')
                                        .reduce((acc, field) => ({...acc, [field.key]: actualFileIds}), {})
                                }
                                setOriginalData(updatedServerData)
                                setData(updatedServerData)
                                setHasChanges(false)
                            })
                            .catch(error => {
                                console.error('Failed to fetch attachment URLs:', error)
                                // Fallback: create entries with empty URLs
                                setUploadedFiles(serverFileIds.map(id => ({id, url: ''})))
                                setOriginalData(serverData)
                                setData(serverData)
                                setHasChanges(false)
                            })
                    } else {
                        // No files, clear uploadedFiles
                        setUploadedFiles([])
                        setOriginalData(serverData)
                        setData(serverData)
                        setHasChanges(false)
                    }
                }
            } else {
                // Handle API success=false response
                toast({
                    title: 'Error',
                    description: result.error || result.message || 'Failed to save',
                    variant: 'destructive'
                })
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: `An error occurred while saving ${config.entityName.toLowerCase()}`,
                variant: 'destructive'
            })
        } finally {
            setSaving(false)
        }
    }

    const handlePrint = () => {
        const printContent = `
      ${config.entityName} Details:
      ================
      ${config.fields.map(field => `${field.label}: ${data[field.key] || 'N/A'}`).join('\n')}
      `
        window.print()
    }

    const handleExport = () => {
        const dataStr = JSON.stringify(data, null, 2)
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
        const exportFileDefaultName = `${(data.name || config.entityName).replace(/\s+/g, '_')}_data.json`
        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
    }

    const handleDuplicate = () => {
        const duplicatedData = {
            ...data,
            id: undefined,
            name: `${data.name || config.entityName} (Copy)`
        }
        // Navigate to create new entity with duplicated data
        router.push(`${config.breadcrumbs.create}?duplicate=${encodeURIComponent(JSON.stringify(duplicatedData))}`)
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2))
        toast({
            title: `${config.entityName} Copied`,
            description: `${config.entityName} data copied to clipboard`
        })
    }

    const handleDelete = async () => {
        if (!entityId) return

        if (confirm(`Are you sure you want to delete this ${config.entityName.toLowerCase()}? This action cannot be undone.`)) {
            try {
                const response = await fetch(`${config.apiEndpoint}/${entityId}`, {
                    method: 'DELETE'
                })

                if (response.ok) {
                    toast({
                        title: `${config.entityName} Deleted`,
                        description: `${config.entityName} has been successfully deleted`
                    })
                    router.push(config.breadcrumbs.list)
                } else {
                    toast({
                        title: 'Error',
                        description: `Failed to delete ${config.entityName.toLowerCase()}`,
                        variant: 'destructive'
                    })
                }
            } catch (error) {
                toast({
                    title: 'Error',
                    description: `An error occurred while deleting ${config.entityName.toLowerCase()}`,
                    variant: 'destructive'
                })
            }
        }
    }

    const handleArchive = async () => {
        if (!entityId) return

        try {
            const response = await fetch(`${config.apiEndpoint}/${entityId}/archive`, {
                method: 'POST'
            })

            if (response.ok) {
                toast({
                    title: `${config.entityName} Archived`,
                    description: `${config.entityName} has been successfully archived`
                })
                router.push(config.breadcrumbs.list)
            } else {
                toast({
                    title: 'Error',
                    description: `Failed to archive ${config.entityName.toLowerCase()}`,
                    variant: 'destructive'
                })
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: `An error occurred while archiving ${config.entityName.toLowerCase()}`,
                variant: 'destructive'
            })
        }
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files) {
            const fileArray = Array.from(files)
            // Create local preview URLs instead of uploading immediately
            const newFiles = fileArray.map(file => ({
                id: '',
                url: URL.createObjectURL(file),
                file: file
            }))
            setUploadedFiles([...uploadedFiles, ...newFiles])
            // Reset file input to allow re-uploading the same file
            event.target.value = ''
        }
    }

    const removeFile = async (index: number) => {
        const fileToRemove = uploadedFiles[index]
        if (fileToRemove) {
            // Revoke local object URL if it exists
            if (fileToRemove.url && fileToRemove.url.startsWith('blob:')) {
                URL.revokeObjectURL(fileToRemove.url)
            }
        }
        // Don't delete from database immediately - only update UI state
        setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
    }

    const addArrayItem = (fieldKey: string) => {
        setData({
            ...data,
            [fieldKey]: [...(data[fieldKey] || []), '']
        })
    }

    const updateArrayItem = (fieldKey: string, index: number, value: string) => {
        const updatedArray = [...(data[fieldKey] || [])]
        updatedArray[index] = value
        setData({
            ...data,
            [fieldKey]: updatedArray
        })
    }

    const removeArrayItem = (fieldKey: string, index: number) => {
        setData({
            ...data,
            [fieldKey]: data[fieldKey]?.filter((_: any, i: number) => i !== index) || []
        })
    }

    const renderField = (field: FormField) => {
        const value = data[field.key]
        const onChange = (newValue: any) => {
            setData({...data, [field.key]: newValue})
        }

        // Check for validation error
        let errorMessage = null
        if (field.required && (!value || value === '')) {
            errorMessage = `${field.label} is required`
        } else if (field.validation && value !== undefined && value !== null && value !== '') {
            errorMessage = field.validation(value)
        }

        // Determine if field should have error styling
        const hasError = errorMessage !== null

        switch (field.type) {
            case 'text':
                return (
                    <div>
                        <Input
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={field.placeholder}
                            disabled={field.readonly}
                            className={`${field.className || ''} ${hasError ? 'border-red-500 focus:border-red-500' : ''} ${field.readonly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            style={field.width ? { width: field.width } : {}}
                        />
                        {errorMessage && (
                            <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                        )}
                    </div>
                )

            case 'textarea':
                return (
                    <div>
                        <Textarea
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={field.placeholder}
                            disabled={field.readonly}
                            rows={4}
                            className={`${field.className || ''} ${hasError ? 'border-red-500 focus:border-red-500' : ''} ${field.readonly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            style={field.width ? { width: field.width } : {}}
                        />
                        {errorMessage && (
                            <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                        )}
                    </div>
                )

            case 'number':
                return (
                    <div>
                        <Input
                            type="number"
                            value={value || ''}
                            onChange={(e) => onChange(Number(e.target.value) || 0)}
                            placeholder={field.placeholder}
                            disabled={field.readonly}
                            className={`${field.className || ''} ${hasError ? 'border-red-500 focus:border-red-500' : ''} ${field.readonly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            style={field.width ? { width: field.width } : {}}
                        />
                        {errorMessage && (
                            <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                        )}
                    </div>
                )

            case 'select':
                return (
                    <div>
                        <SelectPicker
                            data={field.options || []}
                            value={value}
                            onChange={(newValue) => onChange(newValue)}
                            placeholder={field.placeholder}
                            disabled={field.readonly}
                            className={`${field.className || ''} ${hasError ? 'border-red-500' : ''} ${field.readonly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            style={field.width ? { width: field.width } : {width: '100%'}}
                        />
                        {errorMessage && (
                            <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                        )}
                    </div>
                )

            case 'file':
                return (
                    <div className="space-y-4">
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                            <input
                                type="file"
                                multiple
                                accept={field.accept || "image/*"}
                                onChange={handleFileUpload}
                                className="hidden"
                                id={`file-upload-${field.key}`}
                                style={field.width ? { width: field.width } : {}}
                            />
                            <label
                                htmlFor={`file-upload-${field.key}`}
                                className={`flex flex-col items-center justify-center cursor-pointer ${field.className || ''}`}
                                style={field.width ? { width: field.width } : {}}
                            >
                                {field.icon ? (
                                    <div className="w-8 h-8 text-muted-foreground mb-2">
                                        {field.icon}
                                    </div>
                                ) : (
                                    <Upload className="w-8 h-8 text-muted-foreground mb-2"/>
                                )}
                                <span className="text-sm text-muted-foreground">
                                    {field.uploadText || `Click to upload ${field.label.toLowerCase()}`}
                                </span>
                            </label>
                        </div>

                        <div className="space-y-2">
                            {uploadedFiles.filter(f => f.url).map((file, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <img src={file.url} alt={`File ${index + 1}`}
                                         className="w-16 h-16 object-cover rounded"/>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">File {index + 1}</p>
                                        <p className="text-xs text-muted-foreground">Uploaded file</p>
                                    </div>
                                    <Button
                                        onClick={() => removeFile(index)}
                                        size="sm"
                                        className="p-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <X className="w-4 h-4"/>
                                    </Button>
                                </div>
                            ))}
                            {uploadedFiles.length === 0 && (
                                <p className="text-muted-foreground text-sm">No files uploaded yet</p>
                            )}
                        </div>
                    </div>
                )

            case 'array':
                return (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">{field.label}</label>
                            <Button onClick={() => addArrayItem(field.key)} size="sm" className="gap-2">
                                <Plus className="w-4 h-4"/>
                                Add Item
                            </Button>
                        </div>
                        {(value || []).map((item: string, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input
                                    value={item}
                                    onChange={(e) => updateArrayItem(field.key, index, e.target.value)}
                                    placeholder={field.placeholder}
                                    className="flex-1"
                                />
                                <Button
                                    onClick={() => removeArrayItem(field.key, index)}
                                    size="sm"
                                    className="p-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                                >
                                    <X className="w-4 h-4"/>
                                </Button>
                            </div>
                        ))}
                        {(!value || value.length === 0) && (
                            <p className="text-muted-foreground text-sm">No items added yet</p>
                        )}
                    </div>
                )

            case 'checkbox':
                return (
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id={field.key}
                            checked={value || false}
                            onChange={(e) => onChange(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={field.key} className="text-sm font-medium">
                            {field.label}
                        </label>
                    </div>
                )

            case 'boolean':
            case 'toggle':
                return (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => onChange(!value)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                value ? 'bg-primary' : 'bg-gray-200'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    value ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                )

            case 'date':
            case 'datetime':
                return (
                    <DatePickerField
                        value={value}
                        onChange={onChange}
                        placeholder={field.placeholder || 'Select date'}
                        includeTime={field.type === 'datetime'}
                        disabled={field.readonly}
                        required={field.required}
                        className={field.className}
                    />
                )

            default:
                return null
        }
    }

    // Group fields by gridRow for proper grid layout
    const groupedFields = config.fields.reduce((acc, field) => {
        // Use gridRow for grouping, default to 0 if not specified
        const gridRow = field.gridRow || 0
        if (!acc[gridRow]) {
            acc[gridRow] = []
        }
        
        // Add field to the appropriate row
        acc[gridRow].push(field)
        
        // Sort fields within each row by gridColumn then by order
        acc[gridRow].sort((a, b) => {
            // First sort by gridColumn if specified
            const aCol = a.gridColumn !== undefined ? a.gridColumn : 999
            const bCol = b.gridColumn !== undefined ? b.gridColumn : 999
            if (aCol !== bCol) return aCol - bCol
            
            // Then sort by order if specified
            const aOrder = a.order !== undefined ? a.order : 999
            const bOrder = b.order !== undefined ? b.order : 999
            return aOrder - bOrder
        })
        
        return acc
    }, {} as Record<number, FormField[]>)

    const formTitle = mode === 'create' ? `Create New ${config.entityName}` : `Edit: ${data.name || config.entityName}`
    const formSubtitle = mode === 'create' ? `Add a new ${config.entityName.toLowerCase()} to your catalog` : `Modify ${config.entityName.toLowerCase()} details and settings`

    return (
        <div className="relative">
            {/* Loading overlay */}
            {loading && mounted && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Loader backdrop content="Loading..." vertical />
                </div>
            )}

            {/* Saving overlay */}
            {saving && mounted && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Loader backdrop content={mode === 'create' ? 'Creating...' : 'Saving...'} vertical />
                </div>
            )}
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <Button
                    size="sm"
                    onClick={() => router.push(config.breadcrumbs.list)}
                    className="gap-2"
                >
                    <IoMdArrowBack className="w-4 h-4" />
                    Back
                </Button>

                {/* Top Action Buttons - Only in Edit Mode */}
                {mode === 'edit' && (
                    <ServerActions
                        actions={serverActions || []}
                        data={[data]}
                        context={actionContext}
                        layout="dropdown"
                        onPrint={onPrint}
                        availableFields={availableFields}
                    />
                )}
            </div>

            {/* Form Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Render grouped fields - EXCLUDE file fields */}
                    {Object.entries(groupedFields).map(([gridRow, fields]) => {
                        // Filter out file fields from main form area
                        const nonFileFields = fields.filter(field => field.type !== 'file')
                        if (nonFileFields.length === 0) return null
                        
                        return (
                            <div key={gridRow} className="bg-card rounded-lg border p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {nonFileFields.map((field) => (
                                        <div 
                                            key={field.key} 
                                            className={`space-y-2 ${
                                                field.gridCols === 2 ? 'md:col-span-2' : 
                                                field.gridCols === 3 ? 'md:col-span-3' : 
                                                'md:col-span-1'
                                            }`}
                                        >
                                            <label className="text-sm font-medium flex items-center gap-1">
                                                {field.label}
                                                {field.required && <span className="text-red-500 ml-1">*</span>}
                                                {field.helper && (
                                                    <Whisper
                                                        placement="bottom"
                                                        trigger="click"
                                                        speaker={<Popover>{field.helper}</Popover>}
                                                    >
                                                        <button type="button" className="text-gray-400 hover:text-gray-600 focus:outline-none">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </Whisper>
                                                )}
                                            </label>
                                            {renderField(field)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}

                    {/* Custom Pages - like Odoo */}
                    {config.customPages && config.customPages
                        .filter(page => !page.show || page.show(data))
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((page) => {
                            const PageComponent = page.component
                            return (
                                <div key={page.key} className="bg-card rounded-lg border p-6">
                                    <h2 className="text-md font-semibold mb-4">{page.label}</h2>
                                    <PageComponent data={data} onDataChange={setData} />
                                </div>
                            )
                        })}
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* File Upload Section */}
                    {config.fields.filter(f => f.type === 'file').length > 0 && (
                        <div className="bg-card rounded-lg border p-6">
                            <h2 className="text-md font-semibold mb-4">Media & Files</h2>
                            <div className="space-y-4">
                                {config.fields.filter(f => f.type === 'file').map((field) => (
                                    <div key={field.key}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                            {field.label}
                                            {field.required && <span className="text-red-500 ml-1">*</span>}
                                            {field.helper && (
                                                <Whisper
                                                    placement="bottom"
                                                    trigger="hover"
                                                    speaker={<Popover>{field.helper}</Popover>}
                                                >
                                                    <button type="button" className="text-gray-400 hover:text-gray-600 focus:outline-none">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </Whisper>
                                            )}
                                        </label>
                                        {renderField(field)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick Actions - Desktop */}
                    <div className="hidden lg:block bg-card rounded-lg border p-6">
                        <h2 className="text-md font-semibold mb-4">Quick Actions</h2>
                        {serverActions && serverActions.length > 0 && (
                            <ServerActions
                                actions={serverActions
                                    .filter(action => !['print', 'export_excel', 'delete', 'duplicate', 'copy_json', 'archive', 'unarchive'].includes(action.key))
                                }
                                data={[data]}
                                context={actionContext}
                                layout="inline"
                                onPrint={onPrint}
                                block
                            />
                        )}
                    </div>

                    {/* Quick Actions - Mobile Drawer */}
                    <div className="lg:hidden">
                        <Whisper
                            trigger="hover"
                            placement={"topEnd"}
                            speaker={<Popover>Quick Actions</Popover>}
                            >
                            <button
                                onClick={() => setShowQuickActions(true)}
                                // className="fixed right-4 top-1/2 -translate-y-1/2 bg-white rounded-lg border shadow-lg p-2 flex items-center justify-center hover:bg-gray-50 z-50"
                                className="fixed right-4 bottom-4 bg-white rounded-lg border shadow-lg p-2 flex items-center justify-center hover:bg-gray-50 z-50"
                            >
                                <BsTools className="w-5 h-5" />
                            </button>
                        </Whisper>

                        <Drawer open={showQuickActions} onClose={() => setShowQuickActions(false)} size="xs" backdrop="static" placement="right">
                            <Drawer.Header>
                                <Drawer.Title>Quick Actions</Drawer.Title>
                            </Drawer.Header>
                            <Drawer.Body>
                                {serverActions && serverActions.length > 0 && (
                                    <ServerActions
                                        actions={serverActions
                                            .filter(action => !['print', 'export_excel', 'delete', 'duplicate', 'copy_json', 'archive', 'unarchive'].includes(action.key))
                                        }
                                        data={[data]}
                                        context={actionContext}
                                        onActionComplete={() => setShowQuickActions(false)}
                                        onPrint={onPrint}
                                        layout="inline"
                                        block
                                    />
                                )}
                            </Drawer.Body>
                        </Drawer>
                    </div>
                </div>
            </div>

            <ActionBar
                open={hasChanges}
                onOpenChange={(open) => {
                    if (!open) {
                        // Only set hasChanges to false if manually closed (not via state)
                        // This prevents interference with programmatic state changes
                        if (hasChanges) {
                            setHasChanges(false)
                        }
                    }
                }}
                side="bottom"
                align="center"
            >
                <ActionBarSelection/>
                <ActionBarSeparator/>
                <ActionBarGroup>
                    <ActionBarItem
                        color="red"
                        size="sm"
                        onClick={() => {
                            if (mode === 'edit' && originalData) {
                                setData(originalData)
                                // Revoke local blob URLs before resetting
                                uploadedFiles.forEach(f => {
                                    if (f.url && f.url.startsWith('blob:')) {
                                        URL.revokeObjectURL(f.url)
                                    }
                                })
                                // Reset uploadedFiles to original file values from originalData
                                const originalFileIds = config.fields
                                    .filter(f => f.type === 'file' && originalData[f.key])
                                    .flatMap(f => Array.isArray(originalData[f.key]) ? originalData[f.key] : [originalData[f.key]])
                                // Fetch URLs from ir_attachment table
                                if (originalFileIds.length > 0) {
                                    fetchAttachmentUrls(originalFileIds)
                                        .then(attachments => {
                                            setUploadedFiles(attachments)
                                            setHasChanges(false)
                                        })
                                        .catch(error => {
                                            console.error('Failed to fetch attachment URLs:', error)
                                            setUploadedFiles(originalFileIds.map(id => ({id, url: ''})))
                                            setHasChanges(false)
                                        })
                                } else {
                                    setUploadedFiles([])
                                    setHasChanges(false)
                                }
                            } else {
                                // Revoke local blob URLs before navigating away
                                uploadedFiles.forEach(f => {
                                    if (f.url && f.url.startsWith('blob:')) {
                                        URL.revokeObjectURL(f.url)
                                    }
                                })
                                router.push(config.breadcrumbs.list)
                            }
                        }}
                        disabled={saving}
                    >
                        Cancel
                    </ActionBarItem>
                    <ActionBarItem
                        appearance="primary"
                        color="green"
                        onClick={handleSubmit}
                        disabled={saving || !isFormValid()}
                    >
                        <IoMdCloudDone className="w-4 h-4 mr-2"/>
                        {saving ? (mode === 'create' ? 'Creating...' : 'Saving...') : (mode === 'create' ? 'Create' : 'Save')}
                    </ActionBarItem>
                </ActionBarGroup>
                <ActionBarClose/>
            </ActionBar>
        </div>
    )
}
