import { NextResponse } from 'next/server'
import { db, announcements } from '../../../lib/drizzle/server'
import { eq } from 'drizzle-orm'
import type { Announcement } from '../../../lib/drizzle/server'

export async function GET() {
  try {
    const allAnnouncements = await db.select().from(announcements)
    return NextResponse.json(allAnnouncements)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, ...announcementData } = body
    
    if (id) {
      // Update existing announcement
      await db
        .update(announcements)
        .set(announcementData as any)
        .where(eq(announcements.id, id))
    } else {
      // Insert new announcement
      await db.insert(announcements).values(announcementData as any)
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
      return NextResponse.json({ error: 'Announcement ID is required' }, { status: 400 })
    }
    
    await db.delete(announcements).where(eq(announcements.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
