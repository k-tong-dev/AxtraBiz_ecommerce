'use client'

import { Card } from '@/components/ui/card'
import { Settings } from 'lucide-react'

export default function AuditLogConfigPage() {
  return (
    <Card className="border-border/50 rounded-none min-h-screen shadow-none pt-4">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-primary/70" />
          <div>
            <h2 className="text-xl font-bold">Audit Log Configuration</h2>
            <p className="text-sm text-muted-foreground">Configure what actions and entities are tracked.</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20">
            <div>
              <p className="font-medium">Log Level</p>
              <p className="text-sm text-muted-foreground">Minimum severity level to record</p>
            </div>
            <span className="text-sm font-medium text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-3 py-1 rounded-full">Info</span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20">
            <div>
              <p className="font-medium">Retention Period</p>
              <p className="text-sm text-muted-foreground">How long to keep logs before auto-deletion</p>
            </div>
            <span className="text-sm font-medium">90 days</span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20">
            <div>
              <p className="font-medium">Tracked Entities</p>
              <p className="text-sm text-muted-foreground">Entity types being monitored</p>
            </div>
            <span className="text-sm font-medium">All</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
