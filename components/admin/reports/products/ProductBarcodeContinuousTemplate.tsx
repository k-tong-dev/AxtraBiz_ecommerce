'use client'

import React from 'react'
import { useBarcode } from 'next-barcode'

interface ProductBarcodeContinuousTemplateProps {
    data: any
}

export function ProductBarcodeContinuousTemplate({data}: ProductBarcodeContinuousTemplateProps) {
    const records = Array.isArray(data) ? data : [data]

    const BarcodeLabel = ({product}: {product: any}) => {
        const barcodeValue = product.barcode || ""
        const { inputRef } = useBarcode({
            value: barcodeValue,
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

        return (
            <div className="border rounded-sm p-4 bg-white inline-block" style={{width: '100mm', height: '50mm'}}>
                <div className="text-center h-full flex flex-col justify-center">
                    <h3 className="font-bold text-lg mb-2" style={{fontSize: '14pt'}}>{product.name || ''}</h3>
                    <div className="flex justify-center mb-2">
                        <svg ref={inputRef} />
                    </div>
                    <div className="text-xl font-bold" style={{fontSize: '16pt'}}>${product.price || '0.00'}</div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white" style={{padding: '20px'}}>
            <div className="flex flex-wrap gap-4 justify-center">
                {records.map((record, index) => (
                    <BarcodeLabel key={index} product={record} />
                ))}
            </div>
        </div>
    )
}
