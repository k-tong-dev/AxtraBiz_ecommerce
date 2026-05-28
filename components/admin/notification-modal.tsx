'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Bell, Megaphone, ShoppingCart, Package, X, Clock, ArrowRight
} from 'lucide-react'

interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  type: 'info' | 'success' | 'warning' | 'promo' | 'order'
  read: boolean
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'New Order #1042',
    message: 'John Doe placed an order for $129.99 — 3 items.',
    time: '2 min ago',
    type: 'order',
    read: false,
  },
  {
    id: '2',
    title: 'Low Stock Alert',
    message: 'Wireless Headphones (SKU: WH-100) has only 2 units left.',
    time: '18 min ago',
    type: 'warning',
    read: false,
  },
  {
    id: '3',
    title: 'New Customer',
    message: 'Sarah Smith just created an account.',
    time: '1 hr ago',
    type: 'info',
    read: false,
  },
  {
    id: '4',
    title: 'Summer Sale',
    message: 'Flash sale ends in 6 hours. 15% off all categories.',
    time: '3 hr ago',
    type: 'promo',
    read: true,
  },
  {
    id: '5',
    title: 'Order Shipped #1039',
    message: 'Order #1039 has been shipped via FedEx. ETA: May 31.',
    time: '5 hr ago',
    type: 'order',
    read: true,
  },
  {
    id: '6',
    title: 'Review Pending',
    message: '5 product reviews are awaiting moderation.',
    time: 'Yesterday',
    type: 'info',
    read: true,
  },
]

const TYPE_ICONS: Record<NotificationItem['type'], React.ReactNode> = {
  info: <Bell className="h-4 w-4" />,
  success: <Package className="h-4 w-4" />,
  warning: <ShoppingCart className="h-4 w-4" />,
  promo: <Megaphone className="h-4 w-4" />,
  order: <ShoppingCart className="h-4 w-4" />,
}

const TYPE_COLORS: Record<NotificationItem['type'], string> = {
  info: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 ring-blue-200/50 dark:ring-blue-800/30',
  success: 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400 ring-green-200/50 dark:ring-green-800/30',
  warning: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 ring-amber-200/50 dark:ring-amber-800/30',
  promo: 'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400 ring-purple-200/50 dark:ring-purple-800/30',
  order: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 ring-emerald-200/50 dark:ring-emerald-800/30',
}

const TYPE_GLOW: Record<NotificationItem['type'], string> = {
  info: 'shadow-blue-500/5',
  success: 'shadow-green-500/5',
  warning: 'shadow-amber-500/5',
  promo: 'shadow-purple-500/5',
  order: 'shadow-emerald-500/5',
}

interface NotificationModalProps {
  open: boolean
  onClose: () => void
  onMarkRead?: () => void
}

export function NotificationModal({ open, onClose, onMarkRead }: NotificationModalProps) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
    } else {
      setVisible(false)
      const t = setTimeout(() => setMounted(false), 250)
      return () => clearTimeout(t)
    }
  }, [open])

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    onMarkRead?.()
  }

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          visible ? 'bg-black/30 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-0'
        }`}
        onClick={onClose}
      />

      <div
        className={`relative w-full max-w-md max-h-[80vh] flex flex-col rounded-[28px] border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl transition-all duration-250 ease-out ${
          visible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-[17px] font-semibold tracking-tight text-foreground/90">
                Notifications
              </h2>
              <p className="text-[11px] text-muted-foreground/50 mt-0.5 font-medium">
                {notifications.filter(n => !n.read).length} unread
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {notifications.some(n => !n.read) && (
              <button
                type="button"
                onClick={markAllRead}
                className="flex items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-semibold text-primary/70 hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
              >
                Mark all read
                <ArrowRight className="h-3 w-3" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4 text-muted-foreground/40" />
            </button>
          </div>
        </div>

        <div className="mx-6 border-t border-border/30" />

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-2.5 scroll-smooth scrollbar-thin">
          {notifications.map((notif, i) => (
            <div
              key={notif.id}
              className={`group relative rounded-2xl border p-4 transition-all duration-300 ease-out ${
                notif.read
                  ? 'border-border/20 bg-muted/15'
                  : 'border-border/40 bg-background shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.2)]'
              } ${notif.read ? '' : TYPE_GLOW[notif.type]}`}
              style={{
                animation: visible
                  ? `notif-slide-up 0.35s ease-out ${i * 0.06}s both`
                  : 'none',
              }}
            >
              <div className="flex items-start gap-3.5">
                {/* Icon */}
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ${
                    TYPE_COLORS[notif.type]
                  } ${notif.read ? 'opacity-60' : ''}`}
                >
                  {TYPE_ICONS[notif.type]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h3
                      className={`text-[13px] leading-snug ${
                        notif.read
                          ? 'font-medium text-foreground/60'
                          : 'font-semibold text-foreground/90'
                      }`}
                    >
                      {notif.title}
                    </h3>

                    {!notif.read && (
                      <span className="mt-1 shrink-0 h-2 w-2 rounded-full bg-primary/70" />
                    )}
                  </div>

                  <p
                    className={`mt-1 text-[12px] leading-relaxed ${
                      notif.read
                        ? 'text-muted-foreground/45'
                        : 'text-muted-foreground/65'
                    }`}
                  >
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-1.5 mt-2">
                    <Clock className="h-3 w-3 text-muted-foreground/30" />
                    <span className="text-[10px] font-medium text-muted-foreground/35">
                      {notif.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover subtle accent bar */}
              {!notif.read && (
                <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/30 ring-1 ring-border/20 mb-4">
                <Bell className="h-6 w-6 text-muted-foreground/20" />
              </div>
              <p className="text-sm font-medium text-muted-foreground/40">All caught up</p>
              <p className="text-xs text-muted-foreground/25 mt-1">No new notifications</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-between px-6 py-3.5 border-t border-border/30">
          <span className="text-[10px] font-medium text-muted-foreground/30">
            {notifications.filter(n => !n.read).length} unread
          </span>
          <span className="text-[10px] font-medium text-muted-foreground/30">
            {notifications.length} total
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes notif-slide-up {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  )
}
