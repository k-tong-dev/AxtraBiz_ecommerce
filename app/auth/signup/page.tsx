'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, CheckCircle2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { Divider } from 'rsuite'
import { showToast } from '@/lib/ui/toast'

function SignupPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/shop'
  const { user, isLoading: authLoading, signup, loginWithGoogle, logout } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    // Don't redirect logged-in users from signup page
    // They might want to create a new account or switch accounts
  }, [authLoading, redirect, router, user])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.14),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.18),_transparent_30%)] px-4 py-12">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="w-full max-w-md justify-self-center lg:order-2">
          <div className="space-y-6 rounded-3xl border border-border/60 bg-card/90 p-8 shadow-2xl backdrop-blur">
            <div className="space-y-2">
              <p className="text-sm font-medium text-primary">New customer account</p>
              <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
              <p className="text-sm text-muted-foreground">
                Save your orders, keep your cart in sync, and access protected pages.
              </p>
              {user && (
                <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
                  <p className="text-sm text-yellow-800">
                    You're already signed in as <strong>{user.email}</strong>. 
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-yellow-800 underline ml-1"
                      onClick={async () => {
                        await logout()
                      }}
                    >
                      Sign out
                    </Button> 
                    {' '}to create a new account.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" />
              </div>
            </div>

            <Button
              className="w-full"
              disabled={saving || authLoading || !email || !password || !name}
              onClick={async () => {
                setSaving(true)
                const created = await signup(name, email, password)
                setSaving(false)
                if (!created) {
                  const message = 'Sign up failed. Please verify your details and Supabase auth settings.'
                  setNotice(message)
                  showToast('error', 'Could not create account', message)
                  return
                }
                
                if (created.needsVerification) {
                  const message = 'Account created! Check your email for verification code.'
                  setNotice(message)
                  showToast('success', 'Check your email', message)
                  setTimeout(() => {
                    router.push(`/website/verify-otp?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirect)}`)
                  }, 1500)
                } else {
                  const message = 'Account created successfully!'
                  setNotice(message)
                  showToast('success', 'Welcome!', message)
                  setTimeout(() => router.push(redirect), 1200)
                }
              }}
            >
              {saving ? 'Creating...' : 'Create account'}
            </Button>

            <Divider className="!my-1">or</Divider>

            <Button
              variant="outline"
              className="w-full"
              disabled={saving || authLoading}
              onClick={async () => {
                const ok = await loginWithGoogle()
                if (!ok) {
                  const message = 'Google sign-up failed.'
                  setNotice(message)
                  showToast('error', 'Google sign-up failed', 'Please try again or use email and password.')
                }
              }}
            >
              Continue with Google
            </Button>

            {notice && <p className="text-sm text-muted-foreground">{notice}</p>}

            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href={`/auth/signin?redirect=${encodeURIComponent(redirect)}`} className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden rounded-3xl border border-border/60 bg-card/70 p-10 shadow-xl backdrop-blur lg:block">
          <div className="max-w-lg space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
              <UserPlus className="h-4 w-4" />
              Fast onboarding
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-bold tracking-tight">Start shopping and managing your account in minutes</h2>
              <p className="text-base leading-7 text-muted-foreground">
                Create one account to continue checkout, view orders, and access your saved profile across the storefront.
              </p>
            </div>
            <div className="grid gap-3">
              <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <p className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Real session flow
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  After authentication, the app redirects you back to the page you wanted.
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <p className="flex items-center gap-2 font-medium">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  Better recovery
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Errors now surface through RSuite toast messages instead of getting lost in the page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen px-4 py-12">
          <div className="mx-auto min-h-[calc(100vh-6rem)] w-full max-w-md rounded-3xl border border-border/60 bg-card/90 p-8 shadow-2xl backdrop-blur" />
        </div>
      }
    >
      <SignupPageContent />
    </Suspense>
  )
}

