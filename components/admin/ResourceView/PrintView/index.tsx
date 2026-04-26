'use client'

import React, {useEffect, useState, useRef} from 'react'
import {Modal} from 'rsuite'
import {Button} from '@/components/ui/button'
import {Printer, Download} from 'lucide-react'
import {DefaultPrintTemplate} from '../Print/DefaultPrintTemplate'

interface PrintViewProps {
    open: boolean
    data: any[]
    mode: 'single' | 'bulk'
    title?: string
    template?: React.ComponentType<any>
    onClose: () => void
}

export function PrintView({open, data, mode, title = 'Print', template: Template, onClose}: PrintViewProps) {
    const [customTemplate, setCustomTemplate] = useState<React.ComponentType<any> | null>(null)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        // Load custom template if specified
        if (Template) {
            setCustomTemplate(() => Template)
        }
    }, [Template])

    useEffect(() => {
        // Update iframe content when data or template changes
        if (open && data && iframeRef.current && iframeRef.current.contentDocument) {
            const content = iframeRef.current.contentDocument
            const printContentDiv = document.querySelector('#print-preview-content')
            
            // Get all stylesheets from the main document
            const stylesheets = Array.from(document.styleSheets)
                .map(sheet => {
                    try {
                        return Array.from(sheet.cssRules)
                            .map(rule => rule.cssText)
                            .join('\n')
                    } catch (e) {
                        return ''
                    }
                })
                .join('\n')
            
            content.open()
            content.write('<!DOCTYPE html><html><head>')
            content.write('<meta charset="utf-8">')
            content.write('<style>@page { margin: 0; size: auto; } body { margin: 0; padding: 0; }</style>')
            content.write('<style>' + stylesheets + '</style>')
            content.write('</head><body>')
            content.write(printContentDiv?.innerHTML || '')
            content.write('</body></html>')
            content.close()
        }
    }, [open, data, customTemplate])

    const handlePrint = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.print()
        }
    }

    const handleDownloadPDF = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.print()
        }
    }

    if (!data) {
        return null
    }

    const TemplateComponent = customTemplate || DefaultPrintTemplate

    const printContent = (
        <div style={{padding: '20px'}}>
            {customTemplate ? (
                React.createElement(customTemplate, {data})
            ) : (
                <TemplateComponent data={data} mode={mode}/>
            )}
        </div>
    )

    return (
        <>
            <Modal 
                open={open} 
                onClose={onClose}
                full
                backdrop="static"
                size="full"
            >
                <Modal.Header>
                    <div className="flex items-center justify-between w-full">
                        <h1 className="text-xl font-bold">{title}</h1>
                        <div className="flex gap-2">
                            <Button onClick={handlePrint} color='violet' appearance='primary' size="sm">
                                <Printer className="w-4 h-4 mr-2"/>
                                Print
                            </Button>
                            <Button onClick={handleDownloadPDF} size="sm" appearance="subtle">
                                <Download className="w-4 h-4 mr-2"/>
                                Download PDF
                            </Button>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body style={{padding: 0, overflow: 'auto'}}>
                    <div className="bg-white">
                        {printContent}
                    </div>
                </Modal.Body>
            </Modal>

            {/* Hidden iframe for printing */}
            <iframe
                ref={iframeRef}
                style={{display: 'none'}}
                title="Print Frame"
            />

            {/* Hidden container for iframe content */}
            <div id="print-preview-content" style={{display: 'none'}}>
                {printContent}
            </div>
        </>
    )
}
