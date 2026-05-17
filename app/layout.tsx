import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import 'rsuite/dist/rsuite-no-reset.min.css';
import './globals.css'
import './src/css/rsuite_to_heroui_style.css'
import './src/css/rsuite_table_style.css'

const _dmSans = DM_Sans({ subsets: ["latin"], display: "swap", variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Tinh Iey',
  description: 'Enjoy with Tinh Iey',
  generator: 'Tinh Iey',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_dmSans.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
