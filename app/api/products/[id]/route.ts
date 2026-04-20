import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/drizzle/server'
import { products } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1)

    if (!product || product.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product[0])
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
    const body = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!body.name || body.name.trim() === '') {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      )
    }
    const updateData:any = {
      name: body.name?.trim(),
      description: body.description?.trim() || '',
      price: body.price ? parseFloat(body.price) : 0,
      compare_price: body.compare_price ? parseFloat(body.compare_price) : 0,
      cost_price: body.cost_price ? parseFloat(body.cost_price) : 0,
      original_price: body.original_price || null,
      image_ids: body.image_ids || [],
      sku: body.sku || '',
      barcode: body.barcode || '',
      slug: body.slug || '',
      Slug: body.Slug || '',
      category: body.category?.trim() || 'General',
      rating: Math.min(Number(body.rating) || 0, 9.99).toString(),
      reviews: Number(body.reviews) || 0,
      stock: Number(body.stock) || 0,
      weight: body.weight ? parseFloat(body.weight) : 0,
      dimensions: body.dimensions || '',
      active: body.active !== undefined
          ? (body.active === 'true' || body.active === true)
          : true,
      features: body.features || [],
      updated_at: new Date().toISOString()
    }
    // Update the product
    const updatedProduct = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, productId))
      .returning()

    if (!updatedProduct || updatedProduct.length === 0) {
      return NextResponse.json(
        { error: 'Product not found or update failed' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct[0]
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Delete the product
    const deletedProduct = await db
      .delete(products)
      .where(eq(products.id, productId))
      .returning()

    if (!deletedProduct || deletedProduct.length === 0) {
      return NextResponse.json(
        { error: 'Product not found or delete failed' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
