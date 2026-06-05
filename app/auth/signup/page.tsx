'use client'

import { Suspense, useState, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Schema } from 'rsuite'
import { ArrowRight, UserPlus, Store, BarChart3, ShieldCheck, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import { useAuth } from '@/hooks/use-auth'
import { showToast } from '@/lib/ui/toast'

const model = Schema.Model({
  name: Schema.Types.StringType().isRequired('Name is required'),
  email: Schema.Types.StringType()
    .isRequired('Email is required')
    .isEmail('Invalid email address'),
  password: Schema.Types.StringType()
    .isRequired('Password is required')
    .minLength(8, 'At least 8 characters'),
})

function SignupPageContent() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/website'
  const { signup, loginWithGoogle } = useAuth()
  const formRef = useRef<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const onSubmit = async () => {
    if (!formRef.current?.check()) return
    const values = formRef.current.value
    setSubmitting(true)
    const created = await signup(values.name, values.email, values.password)
    setSubmitting(false)

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
    if (!ok) { showToast('error', 'Google sign-up failed', 'Please try again.') }
    setGoogleLoading(false)
  }

  const perks = [
    { icon: Store, title: 'Multi-store', desc: 'Manage multiple stores from one dashboard.' },
    { icon: BarChart3, title: 'Analytics', desc: 'Track sales, customers, and growth metrics.' },
    { icon: ShieldCheck, title: 'Secure', desc: 'Role-based access and enterprise security.' },
  ]

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[450px] h-[450px] rounded-full bg-blue-500/5 blur-3xl animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute -bottom-32 -left-32 w-[380px] h-[380px] rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute top-1/2 right-1/3 w-[250px] h-[250px] rounded-full bg-emerald-500/5 blur-3xl animate-pulse" style={{ animationDuration: '11s' }} />
      </div>

      <div className="relative z-10 flex w-full max-w-6xl mx-auto px-4 lg:px-8 gap-8 xl:gap-16 items-center">
        <div className="hidden lg:flex lg:w-[45%] flex-col gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.08] px-4 py-1.5 text-xs font-semibold text-blue-500 tracking-wide uppercase">
              <UserPlus className="h-3.5 w-3.5" />
              Get started free
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1]">
              Start your{' '}
              <span className="bg-gradient-to-r from-blue-500 via-primary to-emerald-500 bg-clip-text text-transparent">
                e-commerce journey
              </span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-md">
              Create your account and launch your online store in minutes. No technical skills required.
            </p>
          </div>

          <div className="space-y-3">
            {perks.map((p) => (
              <div
                key={p.title}
                className="group relative rounded-2xl border border-border/40 bg-card/40 p-4 transition-all duration-500 hover:border-blue-500/30 hover:bg-card/70 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-primary/20 p-2.5 ring-1 ring-blue-500/10 group-hover:ring-blue-500/20 transition-all">
                    <p.icon className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{p.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground/80">{p.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative rounded-2xl border border-border/30 bg-gradient-to-br from-blue-500/[0.03] to-primary/[0.03] p-5">
            <Quote className="h-6 w-6 text-blue-500/30 absolute top-3 right-3" />
            <p className="text-sm text-muted-foreground/90 italic leading-relaxed">&ldquo;We went from idea to first sale in under 48 hours. The setup process is incredibly smooth.&rdquo;</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center text-[10px] font-bold text-white">MJ</div>
              <div>
                <p className="text-xs font-medium">Marcus Johnson</p>
                <p className="text-[10px] text-muted-foreground/70">Founder, Urban Threads</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[55%] max-w-md mx-auto lg:mx-0">
          <div className="rounded-3xl border border-border/40 bg-card/70 p-6 sm:p-8 shadow-2xl shadow-black/5 backdrop-blur-2xl">
            <div className="mb-7 lg:hidden">
              <h1 className="text-2xl font-bold">Join AxtraBiz</h1>
              <p className="text-sm text-muted-foreground">Create your account</p>
            </div>

            <div className="space-y-5">
              <Button
                className="w-full h-11"
                appearance="default"
                onClick={handleGoogleSignup}
                disabled={googleLoading || submitting}
              >
                {googleLoading ? 'Connecting...' : (
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
                  <div className="w-full border-t border-border/40" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground/60 tracking-wider">or sign up with email</span>
                </div>
              </div>

              <Form
                ref={formRef}
                model={model}
                onSubmit={onSubmit}
                fluid
                formDefaultValue={{ name: '', email: '', password: '' }}
              >
                <FormField name="name" label="Full name" placeholder="John Doe" />
                <FormField name="email" label="Email" type="email" placeholder="you@example.com" />
                <FormField name="password" label="Password" type="password" placeholder="Min. 8 characters" />

                <Button
                  type="submit"
                  className="w-full h-11 mt-5"
                  appearance="primary"
                  loading={submitting}
                >
                  {submitting ? 'Creating...' : 'Create account'}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Form>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground/70">
              Already have an account?{' '}
              <Link href={`/auth/signin?redirect=${encodeURIComponent(redirect)}`} className="font-medium text-primary hover:underline">
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4"><div className="w-full max-w-md h-[540px] rounded-3xl border border-border/40 bg-card/70 animate-pulse" /></div>}>
      <SignupPageContent />
    </Suspense>
  )
}
