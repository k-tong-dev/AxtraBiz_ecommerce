'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { Divider } from 'rsuite'
import { showToast } from '@/lib/ui/toast'

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/shop'
  const { user, isLoading: authLoading, login, loginWithGoogle, sendPasswordReset } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
      showToast('success', 'Signed in', 'Welcome back to Agile Shop.')
      router.push(redirect)
    } else {
      const message = 'Invalid email or password.'
      setError(message)
      showToast('error', 'Sign-in failed', message)
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),_transparent_30%)] px-4 py-12">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden rounded-3xl border border-border/60 bg-card/70 p-10 shadow-xl backdrop-blur lg:block">
          <div className="max-w-lg space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              Secure shopping dashboard
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight">Welcome back to Agile Shop</h1>
              <p className="text-base leading-7 text-muted-foreground">
                Sign in to manage products, review orders, and continue checkout with your saved account.
              </p>
            </div>
            <div className="grid gap-3">
              <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <p className="flex items-center gap-2 font-medium">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Protected routes
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Profile, orders, checkout, wishlist, and admin pages now require authentication.
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <p className="flex items-center gap-2 font-medium">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  Smart redirect
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  After signing in, you return to the page you originally tried to open.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md justify-self-center">
          <div className="rounded-3xl border border-border/60 bg-card/90 p-8 shadow-2xl backdrop-blur">
            <div className="mb-8 space-y-2">
              <p className="text-sm font-medium text-primary">Account access</p>
              <h2 className="text-3xl font-bold tracking-tight">Sign in</h2>
              <p className="text-sm text-muted-foreground">
                Use your email or Google account to continue.
              </p>
            </div>

            {error && <div className="mb-6 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isLoading || authLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={async () => {
                  setIsLoading(true)
                  const ok = await loginWithGoogle()
                  if (!ok) {
                    const message = 'Google sign-in failed.'
                    setError(message)
                    showToast('error', 'Google sign-in failed', 'Please try again or use email and password.')
                  }
                  setIsLoading(false)
                }}
                disabled={isLoading || authLoading}
              >
                Continue with Google
              </Button>
            </form>

            <Divider className="!my-5">or</Divider>
            <Button
              variant="ghost"
              className="w-full"
              onClick={async () => {
                if (!email) {
                  const message = 'Please enter your email first.'
                  setError(message)
                  showToast('warning', 'Email required', message)
                  return
                }
                const ok = await sendPasswordReset(email)
                if (ok) {
                  setError('')
                  showToast('success', 'Reset email sent', 'Check your inbox for the password reset link.')
                } else {
                  const message = 'Failed to send reset email.'
                  setError(message)
                  showToast('error', 'Reset failed', message)
                }
              }}
            >
              Forgot password?
            </Button>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href={`/shop/signup?redirect=${encodeURIComponent(redirect)}`} className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">Supabase authentication is active for this store.</p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md bg-card border border-border rounded-lg p-8 animate-pulse" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  )
}
