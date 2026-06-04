'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { LogOut, User, MapPin } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/signin?redirect=/website/profile')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
            Redirecting to sign in...
          </div>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    ;(async () => {
      await logout()
      router.push('/shop')
    })()
  }

  return (
    <div className="py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        {/* Profile Card */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-8 pb-8 border-b border-border">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white">
                <User className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          {/* Profile Info */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4 text-lg">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input value={user?.name} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" value={user?.email} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Member Since</label>
                  <Input
                    value={new Date(user?.createdAt || '').toLocaleDateString()}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4 text-lg">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/website/orders">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <User className="w-4 h-4" />
                    View My Orders
                  </Button>
                </Link>
                <Link href="/website/wishlist">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <MapPin className="w-4 h-4" />
                    My Wishlist
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
