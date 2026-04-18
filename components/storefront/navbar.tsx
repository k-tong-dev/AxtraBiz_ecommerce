'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, X, Heart, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle } from 'rsuite'
import { useScrollDirection } from '@/hooks/use-scroll-direction'
import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/hooks/use-auth'

export function Navbar() {
  const { isVisible } = useScrollDirection()
  const { totalItems } = useCart()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/shop" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/50 transition-all">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Agile Shop</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-foreground hover:text-primary transition">
              Home
            </Link>
            <Link href="/shop/products" className="text-foreground hover:text-primary transition">
              Products
            </Link>
            <Link href="/shop/about" className="text-foreground hover:text-primary transition">
              About
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link href="/shop/wishlist" className="relative p-2 hover:bg-secondary rounded-lg transition">
              <Heart className="w-5 h-5" />
            </Link>

            <Link href="/shop/cart" className="relative p-2 hover:bg-secondary rounded-lg transition">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <Button size="sm" className="p-1 h-9 w-9 rounded-full overflow-hidden">
                  <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </Button>
                <div className="absolute right-0 mt-1 w-52 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="font-medium text-sm">{user.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Link href="/shop/profile" className="block px-4 py-2 hover:bg-secondary text-sm">
                    Profile
                  </Link>
                  <Link href="/shop/orders" className="block px-4 py-2 hover:bg-secondary text-sm">
                    Orders
                  </Link>
                  <button 
                    onClick={() => setLogoutModalOpen(true)}
                    className="w-full text-left px-4 py-2 hover:bg-secondary text-sm border-t border-border flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                  <Modal open={logoutModalOpen} backdrop={"static"} onClose={() => setLogoutModalOpen(false)}>
                    <ModalHeader>
                      <ModalTitle>Sign Out</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                      Are you sure you want to sign out? You'll need to sign in again to access your account.
                    </ModalBody>
                    <ModalFooter>
                      <Button appearance="subtle" onClick={() => setLogoutModalOpen(false)}>Cancel</Button>
                      <Button 
                        appearance="primary"
                        color="red"
                        onClick={async () => {
                          await logout()
                          setLogoutModalOpen(false)
                          window.location.reload()
                        }}
                      >
                        Sign Out
                      </Button>
                    </ModalFooter>
                  </Modal>
                </div>
              </div>
            ) : (
              <Link href="/shop/login">
                <Button size="sm">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            <Link href="/shop" className="block px-4 py-2 hover:bg-secondary rounded">
              Home
            </Link>
            <Link href="/shop/products" className="block px-4 py-2 hover:bg-secondary rounded">
              Products
            </Link>
            <Link href="/shop/about" className="block px-4 py-2 hover:bg-secondary rounded">
              About
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
