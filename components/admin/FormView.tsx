'use client'

import {useState, useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {Breadcrumb, Dropdown} from 'rsuite'
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
import {IoMdCloudDone, IoMdSettings} from "react-icons/io";

// Generic field types for the FormView
export interface FormField {
    key: string
    label: string
    type: 'text' | 'textarea' | 'number' | 'select' | 'file' | 'array' | 'json' | 'checkbox' | 'boolean' | 'toggle'
    required?: boolean
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

// Form configuration for different entities
export interface FormConfig {
    entityName: string
    entityNamePlural: string
    apiEndpoint: string
    fields: FormField[]
    actions: {
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
        icon?: React.ReactNode
        onClick: (data: any) => void
        mode?: 'create' | 'edit' | 'both'
        variant?: 'default' | 'primary' | 'danger'
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
    initialData?: T
    entityId?: string
}

export function FormView<T extends Entity>({mode, config, initialData, entityId}: FormViewProps<T>) {
    const router = useRouter()
    const {toast} = useToast()

    const [data, setData] = useState<MutableEntity>({} as MutableEntity)
    const [originalData, setOriginalData] = useState<MutableEntity | null>(null)
    const [hasChanges, setHasChanges] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

    // Initialize form data
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setData(initialData as MutableEntity)
            setOriginalData(initialData as MutableEntity)
            setLoading(false)
        } else if (mode === 'create') {
            // Initialize with default values
            const defaultData: MutableEntity = {} as MutableEntity
            config.fields.forEach(field => {
                if (field.type === 'array' || field.type === 'json') {
                    defaultData[field.key] = []
                } else if (field.type === 'number') {
                    defaultData[field.key] = 0
                } else {
                    defaultData[field.key] = ''
                }
            })
            setData(defaultData)
            setOriginalData(defaultData)
            setLoading(false)
        }
    }, [mode, initialData, config.fields])

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

        const isChanged = JSON.stringify({
            ...data,
            // Handle file uploads separately
            ...config.fields
                .filter(f => f.type === 'file')
                .reduce((acc, field) => ({...acc, [field.key]: uploadedFiles}), {})
        }) !== JSON.stringify({
            ...originalData,
            // Handle file uploads separately
            ...config.fields
                .filter(f => f.type === 'file')
                .reduce((acc, field) => ({...acc, [field.key]: originalData[field.key] || []}), {})
        })

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

            // Handle file uploads
            config.fields
                .filter(f => f.type === 'file')
                .forEach(field => {
                    if (uploadedFiles.length > 0) {
                        payload[field.key] = uploadedFiles
                    }
                })

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
            console.log('API Response:', result)

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
                    setOriginalData({...data, active: payload.active})
                    setHasChanges(false)
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

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files) {
            const newFiles = Array.from(files).map(file => URL.createObjectURL(file))
            setUploadedFiles([...uploadedFiles, ...newFiles])
        }
    }

    const removeFile = (index: number) => {
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
                            className={`${field.className || ''} ${hasError ? 'border-red-500 focus:border-red-500' : ''}`}
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
                            rows={4}
                            className={`${field.className || ''} ${hasError ? 'border-red-500 focus:border-red-500' : ''}`}
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
                            className={`${field.className || ''} ${hasError ? 'border-red-500 focus:border-red-500' : ''}`}
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
                            className={`${field.className || ''} ${hasError ? 'border-red-500' : ''}`}
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
                            {uploadedFiles.map((file, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <img src={file} alt={`File ${index + 1}`}
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Loading...</div>
            </div>
        )
    }

    const formTitle = mode === 'create' ? `Create New ${config.entityName}` : `Edit: ${data.name || config.entityName}`
    const formSubtitle = mode === 'create' ? `Add a new ${config.entityName.toLowerCase()} to your catalog` : `Modify ${config.entityName.toLowerCase()} details and settings`

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Breadcrumb
                        className="mb-4 flex gap-2 items-center"
                        separator="/"
                    >
                        <Breadcrumb.Item>
                            <a href={config.breadcrumbs.base}
                               className="hover:text-primary text-sm transition-colors">Dashboard</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <a href={config.breadcrumbs.list}
                               className="hover:text-primary text-sm transition-colors">{config.entityNamePlural}</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>
                            <span
                                className="text-sm font-medium">{mode === 'create' ? `Create ${config.entityName}` : `Edit ${config.entityName}`}</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>

                    <h1 className="text-2xl font-bold">{formTitle}</h1>
                    <p className="text-sm text-muted-foreground">{formSubtitle}</p>
                </div>

                {/* Top Action Buttons - Only in Edit Mode */}
                {mode === 'edit' && (
                    <div className="flex items-center gap-2">
                        <Dropdown
                            title="Actions"
                            placement="bottomEnd"
                            renderToggle={(props, ref) => (
                                <Button
                                    {...props}
                                    ref={ref}
                                    className="gap-2"
                                    startIcon={<IoMdSettings className={"w-5 h-5"}/>}
                                >
                                    Actions
                                </Button>
                            )}
                        >
                            {config.actions.print && (
                                <Dropdown.Item icon={<Printer className="w-4 h-4"/>} onClick={handlePrint}>
                                    Print
                                </Dropdown.Item>
                            )}
                            {config.actions.export && (
                                <Dropdown.Item icon={<Copy className="w-4 h-4"/>} onClick={handleExport}>
                                    Export
                                </Dropdown.Item>
                            )}
                            {config.actions.duplicate && (
                                <Dropdown.Item icon={<Copy className="w-4 h-4"/>} onClick={handleDuplicate}>
                                    Duplicate
                                </Dropdown.Item>
                            )}
                            {config.actions.copy && (
                                <Dropdown.Item icon={<Copy className="w-4 h-4"/>} onClick={handleCopy}>
                                    Copy {config.entityName}
                                </Dropdown.Item>
                            )}
                            {config.actions.archive && (
                                <Dropdown.Item icon={<Archive className="w-4 h-4"/>} onClick={handleArchive}>
                                    Archive {config.entityName}
                                </Dropdown.Item>
                            )}
                            {config.actions.delete && (
                                <Dropdown.Item icon={<Trash2 className="w-4 h-4"/>} onClick={handleDelete}
                                               className="text-red-600">
                                    Delete
                                </Dropdown.Item>
                            )}
                        </Dropdown>
                    </div>
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
                                            <label className="text-sm font-medium">
                                                {field.label}
                                                {field.required && <span className="text-red-500 ml-1">*</span>}
                                            </label>
                                            {renderField(field)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* File Upload Section */}
                    {config.fields.filter(f => f.type === 'file').length > 0 && (
                        <div className="bg-card rounded-lg border p-6">
                            <h2 className="text-lg font-semibold mb-4">Media & Files</h2>
                            <div className="space-y-4">
                                {config.fields.filter(f => f.type === 'file').map((field) => (
                                    <div key={field.key}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {field.label}
                                            {field.required && <span className="text-red-500 ml-1">*</span>}
                                        </label>
                                        {renderField(field)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Quick Actions */}
                    <div className="bg-card rounded-lg border p-6">
                        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                        <div className="space-y-2">
                            {config.customActions && config.customActions
                                .filter(action => !action.mode || action.mode === mode || action.mode === 'both')
                                .map((action) => (
                                    <button
                                        key={action.key}
                                        onClick={() => action.onClick(data)}
                                        className={`w-full text-left px-4 py-2 text-sm rounded-md border flex items-center gap-2 ${
                                            action.variant === 'primary' 
                                                ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-primary' 
                                                : action.variant === 'danger'
                                                    ? 'bg-red-50 text-red-700 hover:bg-red-100 border-red-300'
                                                    : 'bg-gray-50 hover:bg-gray-100 border-gray-300'
                                        }`}
                                    >
                                        {action.icon && <span className="w-5 h-5">{action.icon}</span>}
                                        {action.label}
                                    </button>
                                ))
                            }
                            
                            {/* Built-in actions if no custom actions defined */}
                            {!config.customActions && (
                                <>
                                    {config.actions.print && (
                                        <button
                                            onClick={handlePrint}
                                            className="w-full text-left px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-300"
                                        >
                                            🖨️ Print {config.entityName}
                                        </button>
                                    )}
                                    {config.actions.export && (
                                        <button
                                            onClick={handleExport}
                                            className="w-full text-left px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-300"
                                        >
                                            📤 Export Data
                                        </button>
                                    )}
                                    {mode === 'edit' && config.actions.duplicate && (
                                        <button
                                            onClick={handleDuplicate}
                                            className="w-full text-left px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-300"
                                        >
                                            📋 Duplicate {config.entityName}
                                        </button>
                                    )}
                                    {config.actions.copy && (
                                        <button
                                            onClick={handleCopy}
                                            className="w-full text-left px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-300"
                                        >
                                            📋 Copy Data
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Action Bar - Smart Minimal */}
            <ActionBar
                open={hasChanges}
                onOpenChange={(open) => !open && setHasChanges(false)}
                side="bottom"
                align="center"
            >
                <ActionBarSelection/>
                <ActionBarSeparator/>
                <ActionBarGroup>
                    <ActionBarItem
                        color="red"
                        size="sm"
                        onClick={() => router.push(config.breadcrumbs.list)}
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
