import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const { path, attachmentId } = await request.json()

  if (!path && !attachmentId) {
    return NextResponse.json({ error: 'Missing path or attachmentId' }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRole) {
    return NextResponse.json({ error: 'Supabase env not configured' }, { status: 500 })
  }

  const supabase = createClient(url, serviceRole, { auth: { persistSession: false } })

  // Delete from storage
  if (path) {
    const { error: deleteError } = await supabase.storage
      .from('ir_attachments')
      .remove([path])

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }
  }

  // Delete ir_attachment record
  if (attachmentId) {
    const { error: deleteRecordError } = await supabase
      .from('ir_attachment')
      .delete()
      .eq('id', attachmentId)

    if (deleteRecordError) {
      return NextResponse.json({ error: deleteRecordError.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
