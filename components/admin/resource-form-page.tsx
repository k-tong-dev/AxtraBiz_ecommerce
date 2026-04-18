'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
  FileUploadList,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadClear,
} from '@/components/ui/file-upload'
import { Form, Input as RsInput, InputNumber, Toggle, Schema } from 'rsuite'
import { AdminFormActionBar } from '@/components/admin/form-action-bar'
import {
  createDefaultRecord,
  deleteRecord,
  fetchRecordById,
  getAdminResourceStateLabel,
  getAdminResourceTitle,
  type AdminRecord,
  type AdminResource,
  upsertRecord,
} from '@/lib/admin-resource-config'
import { showToast } from '@/lib/ui/toast'

function isPrimitive(value: unknown) {
  return value === null || ['string', 'number', 'boolean'].includes(typeof value)
}

export function AdminResourceFormPage({
  resource,
  mode,
  id,
}: {
  resource: AdminResource
  mode: 'create' | 'edit'
  id?: string
}) {
  const router = useRouter()
  const [record, setRecord] = useState<AdminRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [formError, setFormError] = useState<Record<string, string>>({})
  const formRef = useRef<any>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (mode === 'create') {
        if (!mounted) return
        setRecord(createDefaultRecord(resource))
        setLoading(false)
        return
      }

      if (!id) {
        setLoading(false)
        return
      }

      const found = await fetchRecordById(resource, id)
      if (!mounted) return
      setRecord(found)
      setLoading(false)
    })()

    return () => {
      mounted = false
    }
  }, [id, mode, resource])

  const title = `${mode === 'create' ? 'Create' : 'Edit'} ${getAdminResourceTitle(resource)}`
  const state = useMemo(
    () => (record ? getAdminResourceStateLabel(resource, record) : undefined),
    [record, resource],
  )

  const primitiveEntries = useMemo(() => {
    if (!record) return []
    return Object.entries(record as Record<string, unknown>).filter(
      ([key, value]) =>
        key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && isPrimitive(value),
    )
  }, [record])

  const objectEntries = useMemo(() => {
    if (!record) return []
    return Object.entries(record as Record<string, unknown>).filter(
      ([key, value]) =>
        key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && !isPrimitive(value),
    )
  }, [record])

  const productImageUrls = useMemo(() => {
    if (resource !== 'products' || !record) return []
    const p = record as any
    const imgs = Array.isArray(p.images) ? p.images.map(String) : []
    return imgs.filter(Boolean)
  }, [record, resource])

  const productImageIds = useMemo(() => {
    if (resource !== 'products' || !record) return []
    const p = record as any
    const ids = Array.isArray(p.image_ids) ? p.image_ids.map(String) : []
    return ids.filter(Boolean)
  }, [record, resource])

  const formModel = useMemo(() => {
    const { StringType, NumberType, BooleanType } = Schema.Types
    const base: Record<string, any> = {
      id: StringType().isRequired('ID is required').minLength(2, 'ID is too short'),
    }
    if (resource === 'products') {
      base.name = StringType().isRequired('Name is required').minLength(2, 'Name is too short')
      base.category = StringType().isRequired('Category is required')
      base.description = StringType().isRequired('Description is required')
      base.price = NumberType().isRequired('Price is required').min(0, 'Price must be >= 0')
      base.stock = NumberType().isRequired('Stock is required').min(0, 'Stock must be >= 0')
      base.rating = NumberType().range(0, 5, 'Rating must be between 0 and 5')
      base.reviews = NumberType().min(0, 'Reviews must be >= 0')
    }
    if (resource === 'customers') {
      base.email = StringType().isRequired('Email is required').isEmail('Invalid email')
      base.name = StringType().isRequired('Name is required').minLength(2, 'Name is too short')
      base.role = StringType().addRule(
        (value: string) => ['admin', 'customer'].includes(value),
        'Role must be admin or customer',
      )
    }
    if (resource === 'orders') {
      base.userId = StringType().isRequired('Customer/user id is required')
      base.status = StringType().addRule(
        (value: string) =>
          ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(value),
        'Invalid order status',
      )
      base.totalPrice = NumberType().isRequired('Total is required').min(0, 'Total must be >= 0')
      base.createdAt = StringType().isRequired('Created date is required')
    }
    if (resource === 'invoices') {
      base.orderId = StringType().isRequired('Order id is required')
      base.customerId = StringType().isRequired('Customer id is required')
      base.total = NumberType().isRequired('Total is required').min(0, 'Total must be >= 0')
      base.status = StringType().addRule(
        (value: string) => ['draft', 'issued', 'paid', 'void'].includes(value),
        'Invalid invoice status',
      )
    }
    if (resource === 'announcements') {
      base.title = StringType().isRequired('Title is required').minLength(3, 'Title is too short')
      base.message = StringType().isRequired('Message is required').minLength(5, 'Message is too short')
      base.type = StringType().addRule(
        (value: string) => ['info', 'success', 'warning', 'error'].includes(value),
        'Invalid announcement type',
      )
      base.active = BooleanType()
    }
    if (resource === 'settings' || resource === 'configurations') {
      base.key = StringType().isRequired('Key is required')
      base.value = StringType().isRequired('Value is required')
    }
    return Schema.Model(base)
  }, [resource])

  const onSave = async () => {
    if (!record) return
    if (formRef.current && !formRef.current.check()) {
      setNotice('Please fix form validation errors.')
      showToast('warning', 'Validation required', 'Please fix the highlighted form fields before saving.')
      return
    }
    if ((record as any).id === '' || (record as any).id === undefined) {
      setNotice('Please provide a valid ID.')
      showToast('warning', 'Missing ID', 'Please provide a valid record ID before saving.')
      return
    }
    setSaving(true)
    const ok = await upsertRecord(resource, record)
    setSaving(false)
    setNotice(ok ? 'Saved to Supabase.' : 'Save failed (check schema/permissions).')
    if (ok) {
      showToast('success', `${getAdminResourceTitle(resource)} saved`, 'Your changes were synced successfully.')
      router.push(`/admin/${resource}`)
    } else {
      showToast(
        'error',
        `Failed to save ${getAdminResourceTitle(resource).toLowerCase()}`,
        'Check Supabase schema, table availability, and row permissions.',
      )
    }
  }

  const onDelete = async () => {
    if (!record || mode === 'create') return
    const ok = window.confirm(`Delete this ${getAdminResourceTitle(resource).toLowerCase()}?`)
    if (!ok) return
    const done = await deleteRecord(resource, (record as any).id)
    if (done) {
      showToast('success', `${getAdminResourceTitle(resource)} deleted`, 'The record was removed successfully.')
      router.push(`/admin/${resource}`)
    } else {
      setNotice('Delete failed (check schema/permissions).')
      showToast(
        'error',
        `Failed to delete ${getAdminResourceTitle(resource).toLowerCase()}`,
        'Check Supabase schema, table availability, and row permissions.',
      )
    }
  }

  if (loading) {
    return <Card className="mx-auto max-w-5xl p-6">Loading...</Card>
  }

  if (!record) {
    return <Card className="mx-auto max-w-5xl p-6">Record not found.</Card>
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button appearance="default" onClick={() => router.push(`/admin/${resource}`)}>
          Back to {resource}
        </Button>
      </div>

      <AdminFormActionBar
        state={state}
        onSave={onSave}
        onDelete={mode === 'edit' ? onDelete : undefined}
        onPrint={() => window.print()}
        onCustomAction={() => setNotice('Custom action triggered.')}
        customActionLabel="Run Action"
        saveDisabled={saving}
      />

      <Card className="p-6 space-y-6">
        <Form
          ref={formRef}
          fluid
          formValue={record as Record<string, unknown>}
          model={formModel}
          onChange={(next) => setRecord(next as AdminRecord)}
          onCheck={(nextErrors) => setFormError((nextErrors ?? {}) as Record<string, string>)}
        >
          <Form.Group controlId="id">
            <Form.ControlLabel>ID</Form.ControlLabel>
            <Form.Control name="id" accepter={RsInput} />
          </Form.Group>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {primitiveEntries.map(([key, value]) => (
              <Form.Group key={key} controlId={key}>
                <Form.ControlLabel>{key}</Form.ControlLabel>
                {typeof value === 'number' ? (
                  <Form.Control name={key} accepter={InputNumber} />
                ) : typeof value === 'boolean' ? (
                  <Form.Control name={key} accepter={Toggle} />
                ) : (
                  <Form.Control name={key} accepter={RsInput} />
                )}
              </Form.Group>
            ))}
          </div>
        </Form>

        {resource === 'products' && (
          <div className="space-y-3">
            <label className="text-sm font-medium">Product Images (Dice File Upload)</label>
            <FileUpload
              value={uploadFiles}
              onValueChange={setUploadFiles}
              multiple
              maxFiles={10}
              maxSize={5 * 1024 * 1024}
              accept="image/*"
              onUpload={async (files, { onProgress, onSuccess, onError }) => {
                for (const file of files) {
                  try {
                    onProgress(file, 15)
                    const formData = new FormData()
                    formData.append('file', file)

                    const response = await fetch('/api/admin/upload-product-image', {
                      method: 'POST',
                      body: formData,
                    })

                    if (!response.ok) {
                      const payload = await response.json().catch(() => ({}))
                      throw new Error(payload.error ?? 'Upload failed')
                    }

                    const payload = (await response.json()) as { id: string; url: string }
                    onProgress(file, 100)
                    onSuccess(file)

                    setRecord((prev) => {
                      if (!prev) return prev
                      const r = prev as any
                      const nextImages = Array.from(new Set([...(r.images ?? []), payload.url]))
                      const nextImageIds = Array.from(new Set([...(r.image_ids ?? []), payload.id]))
                      return {
                        ...r,
                        image: r.image || payload.url,
                        images: nextImages,
                        image_ids: nextImageIds,
                      }
                    })
                  } catch (error) {
                    onError(file, error as Error)
                    showToast(
                      'error',
                      'Image upload failed',
                      error instanceof Error ? error.message : 'Unable to upload the selected image.',
                    )
                  }
                }
              }}
            >
              <FileUploadDropzone className="border-border/70">
                <p className="text-sm font-medium">Drag and drop images here</p>
                <p className="text-xs text-muted-foreground">Up to 10 files, max 5MB each</p>
                <FileUploadTrigger asChild>
                  <Button type="button" appearance="ghost" size="sm" className="mt-2">
                    Browse Files
                  </Button>
                </FileUploadTrigger>
              </FileUploadDropzone>

              <FileUploadList>
                {uploadFiles.map((file) => (
                  <FileUploadItem key={`${file.name}-${file.size}-${file.lastModified}`} value={file}>
                    <FileUploadItemPreview />
                    <FileUploadItemMetadata />
                    <div className="ml-auto flex items-center gap-2">
                      <FileUploadItemProgress className="w-24" />
                      <FileUploadItemDelete asChild>
                        <Button type="button" appearance="ghost" size="sm">
                          Remove
                        </Button>
                      </FileUploadItemDelete>
                    </div>
                  </FileUploadItem>
                ))}
              </FileUploadList>
              <FileUploadClear asChild>
                <Button type="button" appearance="ghost" size="sm">
                  Clear Queue
                </Button>
              </FileUploadClear>
            </FileUpload>

            {productImageUrls.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Stored image URLs (saved to database):</p>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {productImageUrls.map((url:any) => (
                    <div key={url} className="rounded-md border border-border/60 px-3 py-2 text-xs truncate">
                      {url}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {productImageIds.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Image IDs (reviewable from database):</p>
                <div className="flex flex-wrap gap-2">
                  {productImageIds.map((imageId:any) => (
                    <span key={imageId} className="rounded-full border border-border/60 px-2 py-1 text-xs">
                      {imageId}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {objectEntries.map(([key, value]) => (
          <div key={key} className="space-y-2">
            <label className="text-sm font-medium">{key} (JSON)</label>
            <RsInput
              as="textarea"
              rows={8}
              value={JSON.stringify(value ?? {}, null, 2)}
              onChange={(text) => {
                try {
                  const parsed = JSON.parse(text)
                  setRecord({ ...(record as any), [key]: parsed })
                } catch {
                  // Keep user typing until valid JSON.
                }
              }}
            />
          </div>
        ))}

        {Object.keys(formError).length > 0 && (
          <p className="text-sm text-destructive">
            Please fix validation errors before saving.
          </p>
        )}
        {notice && <p className="text-sm text-muted-foreground">{notice}</p>}
      </Card>
    </div>
  )
}

