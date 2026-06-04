'use client'

import React from 'react'
import { useBarcode } from 'next-barcode'

interface ProductBarcodePrintTemplateProps {
    data: any
}

export function ProductBarcodePrintTemplate({data}: ProductBarcodePrintTemplateProps) {
    const records = Array.isArray(data) ? data : [data]

    const BarcodeLabel = ({product}: {product: any}) => {
        return (
            <div className="shadow-sm rounded-sm p-4 bg-white" style={{width: '100mm', height: '50mm'}}>
                <div className="text-center h-full flex flex-col justify-center">
                    <h3 className="font-bold text-lg mb-2" style={{fontSize: '14pt'}}>{product.name || ''}</h3>
                    <div className="flex justify-center mb-2">
                        {product.barcode ? (
                            <BarcodeRenderer barcode={product.barcode} />
                        ) : (
                            <span>No Barcode</span>
                        )}
                    </div>
                    <div className="text-xl font-bold" style={{fontSize: '16pt'}}>${product.price || '0.00'}</div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white">
            {records.map((record, index) => (
                <div key={index} className="flex justify-center items-center" style={{
                    pageBreakAfter: index < records.length - 1 ? 'always' : 'auto',
                    pageBreakInside: 'avoid',
                    padding: '20px 0'
                }}>
                    <BarcodeLabel product={record} />
                </div>
            ))}
        </div>
    )
}

function BarcodeRenderer({barcode}: {barcode: string}) {
    const { inputRef } = useBarcode({
        value: barcode,
        options: {
            format: 'CODE128',
            displayValue: true,
            fontSize: 14,
            background: '#ffffff',
            lineColor: '#000000',
            width: 2,
            height: 80,
            margin: 0,
        }
    })

    return <svg ref={inputRef} />
}
