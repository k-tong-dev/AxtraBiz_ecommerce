import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const { ids } = await request.json()

  if (!ids || !Array.isArray(ids)) {
    return NextResponse.json({ error: 'Missing or invalid ids' }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRole) {
    return NextResponse.json({ error: 'Supabase env not configured' }, { status: 500 })
  }

  const supabase = createClient(url, serviceRole, { auth: { persistSession: false } })

  try {
    const { data, error } = await supabase
      .from('ir_attachment')
      .select('id, url')
      .in('id', ids)
      .eq('active', true)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ attachments: data || [] })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attachments' }, { status: 500 })
  }
}
