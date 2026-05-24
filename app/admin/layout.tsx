import type { Metadata } from 'next'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminTopNavbar } from '@/components/admin/top-navbar'
import { Toaster } from '@/components/ui/toaster'
import 'rsuite/dist/rsuite-no-reset.min.css';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Agile Shop',
  description: 'Manage your shop with Agile Shop Admin.',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <AdminSidebar />
      <main className="flex-1 md:pl-60 transition-all">
        <AdminTopNavbar />
        <div className="px-4 pb-6 md:px-6">{children}</div>
      </main>
      <Toaster />
    </div>
  )
}
