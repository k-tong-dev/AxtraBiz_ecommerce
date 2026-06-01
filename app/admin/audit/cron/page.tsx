'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock } from 'lucide-react'

export default function AuditLogCronPage() {
  return (
    <Card className="border-border/50 rounded-none min-h-screen shadow-none pt-4">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-6 h-6 text-primary/70" />
          <div>
            <h2 className="text-xl font-bold">Cron Jobs</h2>
            <p className="text-sm text-muted-foreground">Schedule automated log cleanup and maintenance tasks.</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20">
            <div>
              <p className="font-medium">Log Retention Cleanup</p>
              <p className="text-sm text-muted-foreground">Automatically delete logs older than specified days</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Every day at 02:00</span>
              <Button size="sm" appearance="primary" color="violet">Configure</Button>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20">
            <div>
              <p className="font-medium">Log Summary Report</p>
              <p className="text-sm text-muted-foreground">Email weekly summary of system activity</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Every Monday at 09:00</span>
              <Button size="sm" appearance="primary" color="violet">Configure</Button>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20">
            <div>
              <p className="font-medium">Archive Old Logs</p>
              <p className="text-sm text-muted-foreground">Archive logs older than 90 days to cold storage</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">First day of month</span>
              <Button size="sm" appearance="primary" color="violet">Configure</Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
