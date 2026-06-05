'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, UserPlus, Store, BarChart3, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { showToast } from '@/lib/ui/toast'

function SignupPageContent() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/website'
  const { signup, loginWithGoogle } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleSignup = async () => {
    if (!name || !email || !password) return
    setSaving(true)
    const created = await signup(name, email, password)
    setSaving(false)

    if (!created) {
      showToast('error', 'Could not create account', 'Please try again.')
      return
    }

    showToast('success', 'Check your email',
      created.needsVerification ? 'Verification code sent.' : 'Account created successfully.')
  }

  const handleGoogleSignup = async () => {
    setGoogleLoading(true)
    const ok = await loginWithGoogle()
    if (!ok) {
      showToast('error', 'Google sign-up failed', 'Please try again.')
      setGoogleLoading(false)
    }
  }

  const perks = [
    { icon: Store, title: 'Multi-store', desc: 'Manage multiple stores from one dashboard.' },
    { icon: BarChart3, title: 'Analytics', desc: 'Track sales, customers, and growth metrics.' },
    { icon: ShieldCheck, title: 'Secure', desc: 'Role-based access and enterprise security.' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-8">
      <div className="flex w-full max-w-5xl gap-8 xl:gap-12 items-center">
        <div className="hidden lg:flex lg:w-[45%] flex-col gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <UserPlus className="h-3.5 w-3.5" />
              Get started free
            </div>
            <h1 className="text-3xl xl:text-4xl font-bold tracking-tight">
              Join AxtraBiz
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Create your account and start selling online in minutes.
            </p>
          </div>

          <div className="space-y-3">
            {perks.map((p) => (
              <div
                key={p.title}
                className="group rounded-2xl border border-border/50 bg-card/60 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-xl bg-primary/10 p-2.5 transition-colors group-hover:bg-primary/15">
                    <p.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{p.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{p.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-[55%]">
          <div className="rounded-3xl border border-border/50 bg-card/80 p-6 sm:p-8 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <div className="mb-6 lg:hidden">
              <h1 className="text-2xl font-bold">Join AxtraBiz</h1>
              <p className="text-sm text-muted-foreground">Create your account</p>
            </div>

            <div className="space-y-5">
              <Button
                className="w-full"
                appearance="default"
                onClick={handleGoogleSignup}
                disabled={googleLoading || saving}
              >
                {googleLoading ? (
                  'Connecting...'
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/60" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground">or sign up with email</span>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  label="Full name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                  fullWidth
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  fullWidth
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  fullWidth
                />
              </div>

              <Button
                className="w-full"
                appearance="primary"
                loading={saving}
                disabled={saving || !email || !password || !name}
                onClick={handleSignup}
              >
                {saving ? 'Creating...' : 'Create account'}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Already have an account?{' '}
              <Link
                href={`/auth/signin?redirect=${encodeURIComponent(redirect)}`}
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
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
        <div className="min-h-screen flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md h-[500px] rounded-3xl border border-border/50 bg-card/80 animate-pulse" />
        </div>
      }
    >
      <SignupPageContent />
    </Suspense>
  )
}
