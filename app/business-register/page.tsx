'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, AlertCircle, Sparkles, ShoppingBag, Check, Zap, Shield, Store, Building2, Phone, DollarSign, ArrowRight, Banknote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { showToast } from '@/lib/ui/toast'

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'KHR', name: 'Cambodian Riel', symbol: '៛' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
]

export default function BusinessRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', company: '', phone: '', currency: 'USD' })

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError('Shop name is required')
      showToast('error', 'Validation', 'Shop name is required')
      return
    }
    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch('/api/auth/business-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Registration failed')
        setSubmitting(false)
        return
      }
      localStorage.setItem('active_shop_id', String(data.data.shopId))
      setStep(4)
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch {
      setError('Network error. Please try again.')
    }
    setSubmitting(false)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-violet-50/70 via-white to-rose-50/50 dark:from-violet-950/40 dark:via-slate-950 dark:to-rose-950/30">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(244,63,94,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-16 items-center min-h-screen py-12">
        {/* Left — value props */}
        <div className="hidden lg:flex flex-col gap-10 max-w-lg">
          <div className="flex items-center gap-2.5 w-fit group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">AxtraBiz</span>
          </div>

          {/* Steps indicator */}
          <div className="space-y-6">
            {[
              { step: 1, label: 'Shop details', desc: 'Tell us about your business' },
              { step: 2, label: 'Contact & currency', desc: 'How customers reach you' },
              { step: 3, label: 'Launch', desc: 'You\'re almost there!' },
            ].map((s) => (
              <div key={s.step} className={`flex items-start gap-4 transition-all duration-500 ${step >= s.step ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${
                  step > s.step
                    ? 'bg-emerald-500 text-white'
                    : step === s.step
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step > s.step ? <Check className="h-4 w-4" /> : s.step}
                </div>
                <div>
                  <div className="font-semibold text-sm">{s.label}</div>
                  <div className="text-xs text-muted-foreground/70 mt-0.5">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <ul className="space-y-3 text-sm">
            {['Unlimited products', 'Built-in payments', '14-day free trial', 'No credit card required'].map(item => (
              <li key={item} className="flex items-center gap-3 text-foreground/80">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/50">
                  <Check className="h-3 w-3 text-violet-600 dark:text-violet-400" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — form card */}
        <div className="w-full max-w-md mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-rose-500/10 blur-2xl" />

            <div className="relative rounded-2xl border border-white/40 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 p-8 shadow-2xl shadow-violet-500/10 backdrop-blur-2xl">

              {step === 4 ? (
                /* ── Success ── */
                <div className="text-center space-y-5 py-8">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-2xl bg-emerald-400/30 blur-xl animate-pulse" />
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                        <CheckCircle2 className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-[-0.02em]">Your shop is ready!</h2>
                    <p className="text-sm text-muted-foreground/80 mt-2">Redirecting to your dashboard...</p>
                  </div>
                  <div className="w-12 h-1 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 mx-auto animate-pulse" />
                </div>
              ) : (
                <>
                  <div className="mb-7">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/60 dark:border-violet-800/60 bg-violet-50/60 dark:bg-violet-950/40 px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-300 backdrop-blur mb-3">
                      <Zap className="h-3 w-3" />
                      Step {step} of 3
                    </div>
                    <h2 className="text-2xl font-semibold tracking-[-0.02em]">
                      {step === 1 ? 'Name your store' : step === 2 ? 'Contact & currency' : 'Review & launch'}
                    </h2>
                    <p className="text-sm text-muted-foreground/80 mt-1">
                      {step === 1 ? 'This is how customers will find you online.' : step === 2 ? 'Set your local preferences.' : 'Almost ready to start selling.'}
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive ring-1 ring-destructive/20 mb-4">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    {step === 1 && (
                      <>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground/80 mb-1.5 block">Shop name *</label>
                          <div className="relative">
                            <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                            <input
                              value={form.name}
                              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                              placeholder="My Awesome Shop"
                              className="w-full h-11 pl-10 pr-4 rounded-xl border border-border/60 bg-white/60 dark:bg-slate-900/40 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all backdrop-blur"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground/80 mb-1.5 block">Company name (optional)</label>
                          <div className="relative">
                            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                            <input
                              value={form.company}
                              onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                              placeholder="My Company Ltd."
                              className="w-full h-11 pl-10 pr-4 rounded-xl border border-border/60 bg-white/60 dark:bg-slate-900/40 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all backdrop-blur"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground/80 mb-1.5 block">Phone (optional)</label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                            <input
                              value={form.phone}
                              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                              placeholder="+1 (555) 123-4567"
                              className="w-full h-11 pl-10 pr-4 rounded-xl border border-border/60 bg-white/60 dark:bg-slate-900/40 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all backdrop-blur"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground/80 mb-1.5 block">Default currency</label>
                          <div className="relative">
                            <Banknote className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 z-10" />
                            <select
                              value={form.currency}
                              onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                              className="w-full h-11 pl-10 pr-4 rounded-xl border border-border/60 bg-white/60 dark:bg-slate-900/40 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all backdrop-blur appearance-none cursor-pointer"
                            >
                              {CURRENCIES.map(c => (
                                <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    {step === 3 && (
                      <div className="space-y-3 rounded-xl bg-violet-50/50 dark:bg-violet-950/30 p-5 ring-1 ring-violet-200/50 dark:ring-violet-800/30">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground/70">Shop</span>
                          <span className="font-medium">{form.name || '—'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground/70">Company</span>
                          <span className="font-medium">{form.company || '—'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground/70">Phone</span>
                          <span className="font-medium">{form.phone || '—'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground/70">Currency</span>
                          <span className="font-medium">{CURRENCIES.find(c => c.code === form.currency)?.symbol} {form.currency}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6">
                    {step > 1 && (
                      <Button
                        className="flex-1 h-11"
                        appearance="default"
                        onClick={() => setStep(s => s - 1)}
                      >
                        Back
                      </Button>
                    )}
                    <Button
                      className={`${step > 1 ? 'flex-1' : 'w-full'} h-11 bg-gradient-to-r from-violet-600 to-rose-600 hover:from-violet-700 hover:to-rose-700 shadow-lg shadow-violet-500/25 transition-all duration-300`}
                      appearance="primary"
                      loading={submitting}
                      onClick={() => step === 3 ? handleSubmit() : setStep(s => s + 1)}
                    >
                      {step === 3 ? (submitting ? 'Launching...' : 'Launch shop') : 'Continue'}
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}