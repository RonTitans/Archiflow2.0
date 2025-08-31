import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ArchiFlow - Network Management Platform',
  description: 'Next-generation IPAM/DCIM platform with modern architecture',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}