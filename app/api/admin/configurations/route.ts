import { NextResponse } from 'next/server'
import {
  fetchConfigurationsFromDrizzle,
  upsertConfigurationInDrizzle,
  deleteConfigurationFromDrizzle
} from '@/lib/drizzle/configurations'

export async function GET() {
  try {
    const allConfigurations = await fetchConfigurationsFromDrizzle()
    return NextResponse.json(allConfigurations)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch configurations' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const result = await upsertConfigurationInDrizzle(body)
    
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
      return NextResponse.json({ error: 'Configuration ID is required' }, { status: 400 })
    }
    
    const result = await deleteConfigurationFromDrizzle(id)
    
    if (result) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to delete configuration'
      }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 })
  }
}
