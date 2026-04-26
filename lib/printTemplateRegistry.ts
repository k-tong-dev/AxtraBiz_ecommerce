// Print Template Registry
// Central registry for all print templates to avoid if/else chains

export interface PrintTemplateRegistry {
    [key: string]: () => Promise<{ default: React.ComponentType<any> }>
}

export const printTemplateRegistry: PrintTemplateRegistry = {
    ProductBarcodePrintTemplate: () => 
        import('@/components/admin/reports/products/ProductBarcodePrintTemplate').then(m => ({ default: m.ProductBarcodePrintTemplate })),
    ProductBarcodeContinuousTemplate: () => 
        import('@/components/admin/reports/products/ProductBarcodeContinuousTemplate').then(m => ({ default: m.ProductBarcodeContinuousTemplate })),
    // Add more templates here as needed
    // Example:
    // InvoiceTemplate: () => import('@/components/admin/invoices/InvoiceTemplate').then(m => ({ default: m.InvoiceTemplate })),
}

export async function loadTemplate(templateName: string): Promise<React.ComponentType<any> | null> {
    const templateLoader = printTemplateRegistry[templateName]
    if (!templateLoader) {
        console.warn(`Template "${templateName}" not found in registry`)
        return null
    }
    try {
        const module = await templateLoader()
        return module.default
    } catch (error) {
        console.error(`Failed to load template "${templateName}":`, error)
        return null
    }
}
