import { NextResponse } from 'next/server'
import { db, configurations } from '../../../lib/drizzle/server'
import { eq } from 'drizzle-orm'
import type { Configuration } from '../../../lib/drizzle/server'

export async function GET() {
  try {
    const allConfigurations = await db.select().from(configurations)
    return NextResponse.json(allConfigurations)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch configurations' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, ...configurationData } = body
    
    if (id) {
      // Update existing configuration
      await db
        .update(configurations)
        .set(configurationData as any)
        .where(eq(configurations.id, id))
    } else {
      // Insert new configuration
      await db.insert(configurations).values(configurationData as any)
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
      return NextResponse.json({ error: 'Configuration ID is required' }, { status: 400 })
    }
    
    await db.delete(configurations).where(eq(configurations.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
