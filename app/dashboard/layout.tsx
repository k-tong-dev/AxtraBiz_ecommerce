import type { Metadata } from 'next'
import { AdminSidebar, AdminTopBar, ModuleBar } from '@/components/dashboard/navigation'
import { AuthProvider } from '@/components/dashboard/authProvider'
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
    <AuthProvider>
      <div className="flex min-h-screen overflow-x-hidden">
        <AdminSidebar />
        <main className="flex-1 md:pl-60 transition-all">
          <AdminTopBar />
          <ModuleBar />
          <div>{children}</div>
        </main>
      </div>
    </AuthProvider>
  )
}
