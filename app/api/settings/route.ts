import { NextResponse } from 'next/server'
import { db, settings } from '../../../lib/drizzle/server'
import { eq } from 'drizzle-orm'
import type { Setting } from '../../../lib/drizzle/server'

export async function GET() {
  try {
    const allSettings = await db.select().from(settings)
    return NextResponse.json(allSettings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, ...settingData } = body
    
    if (id) {
      // Update existing setting
      await db
        .update(settings)
        .set(settingData as any)
        .where(eq(settings.id, id))
    } else {
      // Insert new setting
      await db.insert(settings).values(settingData as any)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Setting ID is required' }, { status: 400 })
    }
    
    await db.delete(settings).where(eq(settings.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
