'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useResource } from '@/components/Base/Views/hooks/useResource'
import { ResourceView } from '@/components/Base/Views'
import { auditLogConfig } from './config'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, Tab } from 'rsuite'
import { History, Clock, Settings } from 'lucide-react'

export default function AdminAuditLogsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'logs' | 'cron' | 'config'>('logs')
  const { data: logs, loading, refresh } = useResource<any[]>('/api/admin/audit-logs')
  const { confirmDelete, deleteModal } = useConfirmDelete({
    apiEndpoint: '/api/admin/audit-logs',
    entityName: 'audit log',
    refresh,
    useQueryParam: false,
  })

  const handleRowClick = (row: any) => router.push(`/admin/audit-logs/${row.id}/edit`)

  const config = auditLogConfig.listViewConfig(logs ?? [])

  const renderLogs = () => (
    <>
      {deleteModal}
      <ResourceView
        config={{
          type: 'list',
          title: 'Audit Logs',
          description: 'Track all user actions and system events across the platform.',
          listViewConfig: config,
          formViewConfig: auditLogConfig.formViewConfig,
          enableDefaultActions: true,
          defaultActions: auditLogConfig.defaultActions,
        }}
        onEdit={handleRowClick}
        onDelete={(rowData) => confirmDelete(rowData.id)}
        loading={loading}
        onRefresh={refresh}
      />
    </>
  )

  const renderCron = () => (
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

  const renderConfig = () => (
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

  return (
    <div>
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center gap-1 px-6">
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'logs'
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <History className="w-4 h-4" />
            Logs
          </button>
          <button
            onClick={() => setActiveTab('cron')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'cron'
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Clock className="w-4 h-4" />
            Cron
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'config'
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Settings className="w-4 h-4" />
            Configuration
          </button>
        </div>
      </div>
      {activeTab === 'logs' && renderLogs()}
      {activeTab === 'cron' && renderCron()}
      {activeTab === 'config' && renderConfig()}
    </div>
  )
}
