'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Store, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { showToast } from '@/lib/ui/toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/admin'
  const { user, isLoading: authLoading, login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(redirect)
    }
  }, [authLoading, redirect, router, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const success = await login(email, password)
    if (success) {
      showToast('success', 'Signed in', 'Welcome to the admin dashboard.')
      router.push(redirect)
    } else {
      const message = 'Invalid email or password.'
      setError(message)
      showToast('error', 'Sign-in failed', message)
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary/5 via-background to-accent/5 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Store className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">AxtraBiz Admin</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Manage your shops, staff, orders, products, and everything else
            from a single dashboard.
          </p>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Store className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm">AxtraBiz Admin</span>
          </div>

          <h2 className="text-xl font-semibold mb-1">Sign in</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Enter your credentials to access the admin dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Email
              </label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-destructive font-medium">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <p className="mt-6 text-xs text-center text-muted-foreground">
            Only authorized staff can access this area.{' '}
            <Link href="/shop/login" className="text-primary hover:underline">
              Customer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
