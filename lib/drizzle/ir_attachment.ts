import { db } from '@/lib/drizzle/server'
import { ir_attachment } from '@/drizzle/schema'
import { eq, and } from 'drizzle-orm'

export async function deleteAttachmentsByResModelAndResId(
  resModel: string,
  resId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // First, fetch all attachments for this record
    const attachments = await db
      .select()
      .from(ir_attachment)
      .where(and(
        eq(ir_attachment.res_model, resModel),
        eq(ir_attachment.res_id, resId)
      ))

    if (attachments.length === 0) {
      return { success: true }
    }

    // Delete from Supabase Storage
    const { createClient } = await import('@supabase/supabase-js')
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (url && serviceRole) {
      const supabase = createClient(url, serviceRole, { auth: { persistSession: false } })
      
      // Extract file paths from URLs
      const paths = attachments
        .map((att: any) => {
          const urlParts = att.url.split('/')
          return urlParts[urlParts.length - 1]
        })
        .filter((filename: string) => Boolean(filename))
        .map((filename: string) => `ir_attachments/${filename}`)

      if (paths.length > 0) {
        await supabase.storage.from('ir_attachments').remove(paths)
      }
    }

    // Delete from database
    await db
      .delete(ir_attachment)
      .where(and(
        eq(ir_attachment.res_model, resModel),
        eq(ir_attachment.res_id, resId)
      ))

    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }
}

export async function deleteAttachmentById(
  attachmentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Fetch the attachment to get the URL
    const [attachment] = await db
      .select()
      .from(ir_attachment)
      .where(eq(ir_attachment.id, attachmentId))
      .limit(1)

    if (attachment) {
      // Delete from Supabase Storage
      const { createClient } = await import('@supabase/supabase-js')
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (url && serviceRole) {
        const supabase = createClient(url, serviceRole, { auth: { persistSession: false } })
        
        const urlParts = attachment.url.split('/')
        const filename = urlParts[urlParts.length - 1]
        const path = `ir_attachments/${filename}`

        await supabase.storage.from('ir_attachments').remove([path])
      }
    }

    // Delete from database
    await db
      .delete(ir_attachment)
      .where(eq(ir_attachment.id, attachmentId))

    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }
}

export async function fetchAttachmentsByResModelAndResId(
  resModel: string,
  resId: string
) {
  try {
    const attachments = await db
      .select()
      .from(ir_attachment)
      .where(and(
        eq(ir_attachment.res_model, resModel),
        eq(ir_attachment.res_id, resId),
        eq(ir_attachment.active, true)
      ))

    return attachments
  } catch {
    return []
  }
}
