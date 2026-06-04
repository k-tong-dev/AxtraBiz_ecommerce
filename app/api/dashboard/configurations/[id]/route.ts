import { NextResponse } from 'next/server'
import { fetchConfigurationFromDrizzle, configurationService, deleteConfigurationFromDrizzle } from '@/lib/drizzle/configurations'
import { getCurrentUserId } from '@/utils/supabase/current-user'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const item = await fetchConfigurationFromDrizzle(id)
    if (!item) return NextResponse.json({ error: 'Configuration not found' }, { status: 404 })
    return NextResponse.json(item)
  } catch { return NextResponse.json({ error: 'Failed to fetch configuration' }, { status: 500 }) }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const userId = await getCurrentUserId()
    const result = await configurationService.write(id, { ...body, id }, userId)
    if (result.success) {
      const updated = await fetchConfigurationFromDrizzle(id)
      return NextResponse.json({ success: true, data: updated })
    }
    return NextResponse.json({ success: false, error: result.error }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const result = await deleteConfigurationFromDrizzle(id)
    return result ? NextResponse.json({ success: true }) : NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
