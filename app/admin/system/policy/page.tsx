'use client'

import { ResourceView } from '@/components/Base/Views'

export default function AdminPolicyPage() {
  return (
    <ResourceView
      config={{
        type: 'custom',
        title: 'Policy Management',
        description: 'System-wide policies and Supabase integration.',
        enableDefaultActions: false,
      }}
    >
      <div className="p-6 text-muted-foreground">
        Policy management — Supabase Row-Level Security policies integration coming soon.
      </div>
    </ResourceView>
  )
}
