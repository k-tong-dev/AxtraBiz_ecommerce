'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Schema } from 'rsuite'
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Sparkles, Check } from 'lucide-react'
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

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useAuth()
  const formRef = useRef<any>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!formRef.current?.check()) return
    const values = formRef.current.value
    setSubmitting(true)
    const success = await signup(values.email, values.password, values.name)
    if (success) {
      showToast('success', 'Account created', 'Welcome to AxtraBiz.')
      router.push('/dashboard')
    } else {
      showToast('error', 'Signup failed', 'Please try again.')
    }
    setSubmitting(false)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50/60 dark:from-indigo-950/40 dark:via-slate-900 dark:to-violet-950/30">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-300/30 to-violet-300/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-fuchsia-300/25 to-pink-200/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="hidden lg:flex flex-col gap-8 max-w-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">AxtraBiz</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl xl:text-6xl font-semibold tracking-tight leading-[1.05]">
              Start your{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-fuchsia-600 bg-clip-text text-transparent">
                free account
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
              Join 12,000+ merchants building modern storefronts. No credit card required.
            </p>
          </div>

          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2.5"><Check className="h-4 w-4 text-indigo-500" /> 14-day free trial</li>
            <li className="flex items-center gap-2.5"><Check className="h-4 w-4 text-indigo-500" /> No credit card required</li>
            <li className="flex items-center gap-2.5"><Check className="h-4 w-4 text-indigo-500" /> Cancel anytime</li>
          </ul>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="relative rounded-2xl border border-border/50 bg-card/80 p-8 shadow-xl shadow-black/[0.04] backdrop-blur-xl">
            <div className="lg:hidden mb-6 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-semibold">AxtraBiz</span>
            </div>

            <div className="mb-7">
              <h2 className="text-2xl font-semibold tracking-tight">Create account</h2>
              <p className="text-sm text-muted-foreground mt-1">Get started in seconds</p>
            </div>

            <Form ref={formRef} model={model} onSubmit={handleSubmit} fluid formDefaultValue={{ name: '', email: '', password: '' }}>
              <div className="space-y-3.5">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground">
                    <User className="h-4 w-4" />
                  </div>
                  <FormField name="name" placeholder="Full name" />
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </div>
                  <FormField name="email" type="email" placeholder="Email address" />
                </div>

                <div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                    </div>
                    <FormField name="password" type={showPassword ? 'text' : 'password'} placeholder="Password (min. 8 chars)" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10" tabIndex={-1}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 mt-5" appearance="primary" loading={submitting}>
                {submitting ? 'Creating account...' : 'Create account'}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
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
