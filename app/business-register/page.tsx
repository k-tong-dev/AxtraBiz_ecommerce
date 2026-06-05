'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import {
  Store, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff, Globe, TrendingUp, Users,
} from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'form' | 'success'>('form')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/business-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Registration failed')
        setIsLoading(false)
        return
      }

      setStep('success')
    } catch {
      setError('Network error. Please try again.')
      setIsLoading(false)
    }
  }

  const benefits = [
    { icon: Store, title: 'Own online store', desc: 'Fully customizable storefront with your branding.' },
    { icon: Globe, title: 'Sell worldwide', desc: 'Multi-currency, multi-language out of the box.' },
    { icon: TrendingUp, title: 'Grow with data', desc: 'Real-time analytics and sales insights.' },
    { icon: Users, title: 'Team management', desc: 'Invite staff with role-based permissions.' },
  ]

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-border/50 bg-card/80 p-8 shadow-2xl shadow-black/5 backdrop-blur-xl text-center space-y-5">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-primary" />
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Account created!</h1>
              <p className="text-sm text-muted-foreground">
                Your business account is ready. Let&apos;s set up your first shop.
              </p>
            </div>
            <Button
              className="w-full"
              appearance="primary"
              onClick={() => { window.location.href = '/auth/setup' }}
            >
              Create your shop
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Link
              href="/auth/signin"
              className="block text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Sign in instead
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-8">
      <div className="flex w-full max-w-5xl gap-8 xl:gap-12 items-center">
        <div className="hidden lg:flex lg:w-[45%] flex-col gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Store className="h-3.5 w-3.5" />
              Start selling
            </div>
            <h1 className="text-3xl xl:text-4xl font-bold tracking-tight">
              Launch your e-commerce business
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Everything you need to start selling online — no technical skills required.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-border/50 bg-card/60 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="shrink-0 rounded-xl bg-primary/10 p-2.5 w-fit mb-3">
                  <b.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-semibold">{b.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-[55%]">
          <div className="rounded-3xl border border-border/50 bg-card/80 p-6 sm:p-8 shadow-2xl shadow-black/5 backdrop-blur-xl">
            <div className="mb-6 lg:hidden">
              <h1 className="text-2xl font-bold">Register your business</h1>
              <p className="text-sm text-muted-foreground">Create an account to start selling online</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive mb-4">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full name"
                placeholder="John Doe"
                value={name}
                onChange={(e: any) => setName(e.target.value)}
                fullWidth
                required
              />
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                fullWidth
                required
              />
              <div>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  fullWidth
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="mt-1 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showPassword ? 'Hide' : 'Show'} password
                </button>
              </div>

              <Button
                type="submit"
                className="w-full"
                appearance="primary"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create account'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/signin" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
