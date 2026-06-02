'use client'

import { ResourceView } from '@/components/Base/Views'

function ActivityPlaceholder() {
  return (
    <div className="p-6 text-muted-foreground">
      Activity log and event stream interface coming soon.
    </div>
  )
}

export default function AdminAuditActivityPage() {
  return (
    <ResourceView
      config={{
        type: 'custom',
        title: 'Activity',
        description: 'Real-time activity stream and event monitoring.',
        enableDefaultActions: false,
        customView: ActivityPlaceholder,
      }}
    />
  )
}
