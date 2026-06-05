'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Bell, User, ExternalLink, Globe, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Modal } from 'rsuite'
import { Button } from '@/components/ui/button'
import { MdCancel, MdLogout } from 'react-icons/md'
import { NotificationModal } from '../notification-modal'

const AUTO_HIDE_DELAY = 4000

export function AdminTopBar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [auto, setAuto] = useState(false)
  const [showLogout, setShowLogout] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  const openPanel = useCallback((isAuto = false) => {
    clearTimer()
    setOpen(true)
    setAuto(isAuto)
    if (isAuto) {
      timer.current = setTimeout(() => {
        setOpen(false)
        setAuto(false)
      }, AUTO_HIDE_DELAY)
    }
  }, [clearTimer])

  const closePanel = useCallback(() => {
    clearTimer()
    setOpen(false)
    setAuto(false)
  }, [clearTimer])

  const toggle = useCallback(() => {
    if (open) closePanel()
    else openPanel(false)
  }, [open, closePanel, openPanel])

  // Click outside to close user dropdown only
  useEffect(() => {
    if (!showUserMenu) return
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showUserMenu])

  useEffect(() => () => clearTimer(), [clearTimer])

  const handleLogout = () => {
    logout()
    setShowLogout(false)
    window.location.href = '/'
  }

  return (
    <>
      {/* ── Container (positioned at top-right) ── */}
      <div ref={panelRef} className="fixed top-4 right-4 z-50 flex items-start gap-2">
        {/* ── Panel (slides from right) ── */}
        <div
          className={`transition-all duration-300 ease-out ${
            open
              ? 'translate-x-0 opacity-100 pointer-events-auto'
              : 'translate-x-[calc(100%+1rem)] opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/95 px-3 py-1.5 backdrop-blur-sm shadow-sm whitespace-nowrap">
            {/* Bell */}
            <button
              type="button"
              onClick={() => {
                setShowNotifs(true)
                closePanel()
              }}
              className="relative flex h-7 w-7 items-center justify-center rounded-full hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <Bell className="h-4 w-4 text-muted-foreground" />
              {hasUnread && (
                <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
              )}
            </button>

            <div className="h-5 w-px bg-border/40" />

            {/* User dropdown (custom) */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setShowUserMenu(v => !v)}
                className="flex items-center gap-1.5 rounded-full hover:bg-muted/40 transition-colors cursor-pointer px-1.5 py-0.5"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[11px] font-semibold text-primary-foreground">
                  {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'A'}
                </span>
                <span className="max-w-[80px] truncate text-sm font-medium text-foreground/80">
                  {user?.name ?? 'Admin'}
                </span>
                <ChevronDown className={`h-3 w-3 text-muted-foreground/50 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-lg py-1.5 z-50">
                  <button
                    type="button"
                    onClick={() => setShowUserMenu(false)}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-foreground/70 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <User className="h-4 w-4 text-muted-foreground/50" />
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false)
                      window.open('/', '_blank')
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-foreground/70 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <Globe className="h-4 w-4 text-muted-foreground/50" />
                    Website
                  </button>
                  <div className="mx-3 my-1 border-t border-border/30" />
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false)
                      setShowLogout(true)
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600/80 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Trigger button ── */}
        <button
          type="button"
          onClick={toggle}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/95 backdrop-blur-sm shadow-sm hover:shadow-md hover:bg-background transition-all cursor-pointer"
          aria-label={open ? 'Close' : 'Open menu'}
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-semibold text-primary-foreground">
            {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'A'}
          </span>
        </button>
      </div>

      {/* ── Notifications modal ── */}
      <NotificationModal
        open={showNotifs}
        onClose={() => setShowNotifs(false)}
        onMarkRead={() => setHasUnread(false)}
      />

      {/* ── Logout modal ── */}
      <Modal
        backdrop="static"
        open={showLogout}
        onClose={() => setShowLogout(false)}
        size="sm"
        draggable
      >
        <Modal.Header>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to logout? You will need to login again to access the admin panel.
        </Modal.Body>
        <Modal.Footer>
          <Button
            endIcon={<MdCancel />}
            onClick={() => setShowLogout(false)}
            className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            Cancel
          </Button>
          <Button
            style={{
              backgroundColor: '#000000',
            }}
            appearance={"primary"}
            onClick={handleLogout}
            className="ml-2 text-muted"
            endIcon={<MdLogout />}
          >
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
