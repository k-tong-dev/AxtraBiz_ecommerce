'use client'

import React, {useState, useEffect} from 'react'
import {TagInput} from 'rsuite'
import {ChevronDown} from 'lucide-react'

export interface SearchField {
    key: string
    label: string
    type?: 'text' | 'number' | 'date'
}

export interface SearchValue {
    fieldKey: string
    value: string
}

export interface SearchProps {
    fields?: SearchField[]
    onSearchChange?: (values: SearchValue[]) => void
    placeholder?: string
    width?: number
    className?: string
}

export function Search({
    fields = [],
    onSearchChange,
    placeholder = "Search...",
    width = 200,
    className = ""
}: SearchProps) {
    const [searchTags, setSearchTags] = useState<SearchValue[]>([])
    const [selectedField, setSelectedField] = useState<string>(
        fields.length > 0 ? fields[0].key : 'all'
    )
    const [fieldDropdownOpen, setFieldDropdownOpen] = useState(false)

    // Notify parent when search values change
    useEffect(() => {
        onSearchChange?.(searchTags)
    }, [searchTags, onSearchChange])

    const handleTagChange = (tags: readonly string[]) => {
        // Convert string tags to SearchValue objects, removing duplicates
        const uniqueTags = Array.from(new Set(tags))
        const searchValues: SearchValue[] = uniqueTags.map(tag => {
            // Parse tag format: "field: value" or just "value"
            const parts = tag.split(': ')
            if (parts.length === 2) {
                const fieldKey = fields.find(f => f.label === parts[0])?.key || 'all'
                return {fieldKey, value: parts[1]}
            }
            return {fieldKey: selectedField, value: tag}
        })
        setSearchTags(searchValues)
    }

    const getFieldLabel = (fieldKey: string) => {
        if (fieldKey === 'all') return 'All'
        const field = fields.find(f => f.key === fieldKey)
        return field?.label || fieldKey
    }

    // Convert SearchValue to string format for TagInput with unique keys
    const tagInputValues = searchTags.map((tag, index) => 
        `${getFieldLabel(tag.fieldKey)}: ${tag.value}`
    )

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {/* TagInput with Field Selector Dropdown */}
            <div className="flex items-center gap-2">
                <div className="relative">
                    <button
                        onClick={() => setFieldDropdownOpen(!fieldDropdownOpen)}
                        className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 focus:outline-none focus:border-violet-500"
                    >
                        {getFieldLabel(selectedField)}
                        <ChevronDown size={14} />
                    </button>
                    {fieldDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 min-w-[150px]">
                            {fields.length > 0 && (
                                <div className="p-2">
                                    <div className="text-xs text-muted-foreground mb-2">Search in:</div>
                                    <div className="flex flex-col gap-1">
                                        <button
                                            onClick={() => {
                                                setSelectedField('all')
                                                setFieldDropdownOpen(false)
                                            }}
                                            className={`text-left px-2 py-1 rounded text-sm ${
                                                selectedField === 'all' 
                                                    ? 'bg-violet-100 text-violet-700' 
                                                    : 'hover:bg-gray-100'
                                            }`}
                                        >
                                            All Fields
                                        </button>
                                        {fields.map(field => (
                                            <button
                                                key={field.key}
                                                onClick={() => {
                                                    setSelectedField(field.key)
                                                    setFieldDropdownOpen(false)
                                                }}
                                            className={`text-left px-2 py-1 rounded text-sm ${
                                                selectedField === field.key 
                                                    ? 'bg-violet-100 text-violet-700' 
                                                    : 'hover:bg-gray-100'
                                            }`}
                                            >
                                                {field.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                <TagInput
                    placeholder={placeholder}
                    value={tagInputValues}
                    onChange={handleTagChange}
                    style={{flex: 1}}
                    trigger="Enter"
                    virtualized={true}
                />
            </div>
        </div>
    )
}
