import { NextResponse } from 'next/server'
import {
  fetchSettingsFromDrizzle,
  upsertSettingInDrizzle,
  deleteSettingFromDrizzle
} from '../../../lib/drizzle/settings'
import type { Setting } from '../../../lib/drizzle/server'

export async function GET() {
  try {
    const allSettings = await fetchSettingsFromDrizzle()
    return NextResponse.json(allSettings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const result = await upsertSettingInDrizzle(body)
    
    if (result.success) {
      return NextResponse.json({ success: true, data: body })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 400 })
    }
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
    
    const result = await deleteSettingFromDrizzle(id)
    
    if (result) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to delete setting'
      }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
