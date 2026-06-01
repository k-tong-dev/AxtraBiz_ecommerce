'use client'

import { ResourceView } from '@/components/Base/Views'

export default function AdminGroupsPage() {
  return (
    <ResourceView
      config={{
        type: 'custom',
        title: 'Groups & Permissions',
        description: 'Manage roles, groups, and permission scopes.',
        enableDefaultActions: false,
      }}
    >
      <div className="p-6 text-muted-foreground">
        Groups &amp; Permissions management coming soon.
      </div>
    </ResourceView>
  )
}
