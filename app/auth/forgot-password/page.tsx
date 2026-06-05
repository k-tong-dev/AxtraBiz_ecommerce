'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Mail, ArrowLeft, CheckCircle2, Lock, RefreshCw, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { useAuth } from '@/hooks/use-auth'
import { showToast } from '@/lib/ui/toast'

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth()
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<{ email: string }>({
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: { email: string }) => {
    const ok = await sendPasswordReset(data.email.trim())
    if (ok) {
      setIsSuccess(true)
      showToast('success', 'Email sent', 'Check your inbox.')
    } else {
      showToast('error', 'Failed', 'Could not send password reset email.')
    }
  }

  const steps = [
    { icon: Mail, title: 'Check your inbox', desc: 'Reset link sent to your email.' },
    { icon: Lock, title: 'Click the link', desc: 'Opens a secure page to set a new password.' },
    { icon: RefreshCw, title: 'All set', desc: 'Sign in with your new password.' },
  ]

  if (isSuccess) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        </div>
        <div className="relative z-10 w-full max-w-md mx-auto px-4">
          <div className="rounded-3xl border border-border/40 bg-card/70 p-8 shadow-2xl shadow-black/5 backdrop-blur-2xl text-center space-y-5">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center ring-1 ring-primary/10">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Check your email</h1>
              <p className="text-sm text-muted-foreground">
                We sent a reset link to{' '}
                <span className="font-medium text-foreground">{form.getValues('email')}</span>
              </p>
            </div>
            <Button className="w-full h-11" appearance="primary" onClick={() => { setIsSuccess(false); form.reset() }}>
              <Mail className="w-4 h-4 mr-1.5" />
              Resend email
            </Button>
            <Link href="/auth/signin" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70 hover:text-primary transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full bg-blue-500/5 blur-3xl animate-pulse" style={{ animationDuration: '9s' }} />
      </div>

      <div className="relative z-10 flex w-full max-w-5xl mx-auto px-4 lg:px-8 gap-8 xl:gap-16 items-center">
        <div className="hidden lg:flex lg:w-[45%] flex-col gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-1.5 text-xs font-semibold text-primary tracking-wide uppercase">
              <Lock className="h-3.5 w-3.5" />
              Password reset
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1]">
              No worries,{' '}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-emerald-500 bg-clip-text text-transparent">
                we&apos;ve got you
              </span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-md">
              Enter your email and we&apos;ll send you a secure link to reset your password.
            </p>
          </div>

          <div className="space-y-3">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="group relative rounded-2xl border border-border/40 bg-card/40 p-4 transition-all duration-500 hover:border-primary/30 hover:bg-card/70 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 text-xs font-bold text-primary shrink-0 mt-0.5 ring-1 ring-primary/10">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{s.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground/80">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative rounded-2xl border border-border/30 bg-gradient-to-br from-primary/[0.03] to-blue-500/[0.03] p-5">
            <Quote className="h-6 w-6 text-primary/30 absolute top-3 right-3" />
            <p className="text-sm text-muted-foreground/90 italic leading-relaxed">&ldquo;Their support team resolved my account issue in under 5 minutes. Exceptional service.&rdquo;</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-[10px] font-bold text-white">AL</div>
              <div>
                <p className="text-xs font-medium">Alex Liu</p>
                <p className="text-[10px] text-muted-foreground/70">Store Owner</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[55%] max-w-md mx-auto lg:mx-0">
          <div className="rounded-3xl border border-border/40 bg-card/70 p-6 sm:p-8 shadow-2xl shadow-black/5 backdrop-blur-2xl">
            <div className="mb-7 lg:hidden">
              <Link href="/auth/signin" className="inline-flex items-center gap-1 text-xs text-muted-foreground/70 hover:text-primary mb-3">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </Link>
              <h1 className="text-2xl font-bold">Forgot password?</h1>
              <p className="text-sm text-muted-foreground">Enter your email for a reset link.</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+$/, message: 'Invalid email' },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" value={field.value} onChange={(e) => field.onChange(e.target.value)} fullWidth />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-11"
                  appearance="primary"
                  loading={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Sending...' : 'Send reset link'}
                  <Mail className="w-4 h-4 ml-1.5" />
                </Button>
              </form>
            </Form>

            <div className="hidden lg:flex mt-6 justify-center">
              <Link href="/auth/signin" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70 hover:text-primary transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
