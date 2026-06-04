import type { Metadata } from 'next'
import { Navbar } from '@/components/storefront/navbar'
import { Footer } from '@/components/storefront/footer'

export const metadata: Metadata = {
  title: 'Agile Shop - Premium Products',
  description: 'Shop premium products with fast delivery and great customer service.',
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
    </>
  )
}
