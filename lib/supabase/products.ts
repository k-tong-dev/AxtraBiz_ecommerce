import type {Product} from '@/lib/types'
import {getSupabaseClient} from './client'

function toStringOrUndefined(value: unknown): string | undefined {
    if (value === null || value === undefined) return undefined
    return String(value)
}

function toNumberOrUndefined(value: unknown): number | undefined {
    if (value === null || value === undefined) return undefined
    const n = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(n) ? n : undefined
}

function mapProductRow(row: Record<string, unknown>): Product | null {
    const id = toStringOrUndefined(row.id)
    const name = toStringOrUndefined(row.name)
    const description = toStringOrUndefined(row.description) || ''
    const price = toNumberOrUndefined(row.price) || 0
    const original_price = toNumberOrUndefined(row.original_price)
    const image = toStringOrUndefined(row.image) || ''
    const category = toStringOrUndefined(row.category) || 'General'
    const rating = toNumberOrUndefined(row.rating) || 0
    const reviews = toNumberOrUndefined(row.reviews) || 0
    const stock = toNumberOrUndefined(row.stock) || 0

    if (!id || !name) return null

    const imagesRaw = row.images
    const images = Array.isArray(imagesRaw) ? imagesRaw.map((v) => String(v)) : undefined
    const featuresRaw = row.features
    const features = Array.isArray(featuresRaw) ? featuresRaw.map((v) => String(v)) : undefined
    const imageIdsRaw = row.image_ids
    const image_ids = Array.isArray(imageIdsRaw) ? imageIdsRaw.map((v) => String(v)) : undefined

    return {
        id,
        name,
        description,
        price,
        original_price,
        image,
        images,
        image_ids,
        category,
        rating,
        reviews,
        stock,
        features,
    }
}

export async function fetchProductsFromSupabase(): Promise<Product[]> {
    const supabase = getSupabaseClient()
    if (!supabase) return []

    try {
        const {data, error} = await supabase.from('products').select('*')
        console.log('data', data)
        if (error || !data) return []

        const mapped = (data as Record<string, unknown>[])
            .map((row) => mapProductRow(row))
            .filter(Boolean) as Product[]

        return mapped
    } catch {
        return []
    }
}

export async function fetchProductFromSupabase(productId: string): Promise<Product | null> {
    const supabase = getSupabaseClient()
    if (!supabase) return null

    try {
        const {data, error} = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .maybeSingle()

        if (error || !data) return null

        return mapProductRow(data as Record<string, unknown>)
    } catch {
        return null
    }
}

export async function upsertProductInSupabase(product: Product): Promise<{ success: boolean; error?: string }> {
    const supabase = getSupabaseClient()
    if (!supabase) return {success: false, error: 'Supabase client not available'}

    try {
        const dbProduct = {
            ...product,
            image_ids: product.image_ids,
        }

        const {error} = await supabase.from('products').upsert(dbProduct as any, {onConflict: 'id'})

        if (error) {
            return {
                success: false,
                error: error.message || 'Failed to save product to database'
            }
        }

        return {success: true}
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Unknown error occurred'
        }
    }
}

export async function deleteProductFromSupabase(productId: string): Promise<boolean> {
    const supabase = getSupabaseClient()
    if (!supabase) return false

    try {
        const {error} = await supabase.from('products').delete().eq('id', productId)
        return !error
    } catch {
        return false
    }
}

