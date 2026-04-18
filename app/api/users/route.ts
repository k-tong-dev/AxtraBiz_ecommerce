import { NextResponse } from 'next/server'
import { db, users } from '../../../lib/drizzle/server'
import { eq } from 'drizzle-orm'
import type { User } from '../../../lib/drizzle/server'

export async function GET() {
  try {
    const allUsers = await db.select().from(users)
    return NextResponse.json(allUsers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, ...userData } = body
    
    if (id) {
      // Update existing user
      await db
        .update(users)
        .set(userData as any)
        .where(eq(users.id, id))
    } else {
      // Insert new user
      await db.insert(users).values(userData as any)
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
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    
    await db.delete(users).where(eq(users.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
