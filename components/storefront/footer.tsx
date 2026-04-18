import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-background text-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-lg">Agile Shop</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Premium products. Exceptional service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-foreground/70">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/shop" className="hover:text-primary transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop/products" className="hover:text-primary transition">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/shop/about" className="hover:text-primary transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/shop/cart" className="hover:text-primary transition">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-foreground/70">
              Support
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/shop/about" className="hover:text-primary transition">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/shop/about" className="hover:text-primary transition">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/shop/about" className="hover:text-primary transition">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/shop/about" className="hover:text-primary transition">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-foreground/70">
              Connect
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              <a
                href="mailto:support@agileshop.com"
                className="hover:text-primary transition"
              >
                support@agileshop.com
              </a>
            </p>
            <div className="flex gap-2">
              <a
                href="#"
                aria-label="Facebook"
                className="p-2 rounded-lg border border-border/70 text-muted-foreground hover:text-primary hover:border-primary/40 transition"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="p-2 rounded-lg border border-border/70 text-muted-foreground hover:text-primary hover:border-primary/40 transition"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="p-2 rounded-lg border border-border/70 text-muted-foreground hover:text-primary hover:border-primary/40 transition"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="p-2 rounded-lg border border-border/70 text-muted-foreground hover:text-primary hover:border-primary/40 transition"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; 2024 Agile Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
