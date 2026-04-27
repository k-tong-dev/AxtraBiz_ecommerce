import { NextResponse } from 'next/server'
import { configurationService } from '../../../lib/drizzle/configurations'
import type { Configuration } from '../../../lib/drizzle/server'

export async function GET() {
  try {
    const allConfigurations = await configurationService.search()
    return NextResponse.json(allConfigurations)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch configurations' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const result = await configurationService.upsert(body)
    
    if (result.success) {
      return NextResponse.json({ success: true, data: result.data })
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
      return NextResponse.json({ error: 'Configuration ID is required' }, { status: 400 })
    }
    
    const result = await configurationService.unlink(id)
    
    if (result.success) {
      return NextResponse.json({ success: true })
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
