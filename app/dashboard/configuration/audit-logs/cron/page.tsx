'use client'

import { ResourceView } from '@/components/Base/Views'

function CronPlaceholder() {
  return (
    <div className="p-6 text-muted-foreground">
      Cron job management interface coming soon.
    </div>
  )
}

export default function AdminAuditCronPage() {
  return (
    <ResourceView
      config={{
        type: 'custom',
        title: 'Cron Jobs',
        description: 'Scheduled tasks and automation jobs.',
        enableDefaultActions: false,
        customView: CronPlaceholder,
      }}
    />
  )
}
