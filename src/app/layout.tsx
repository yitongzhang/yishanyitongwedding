import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import Navigation from '@/components/Navigation'

const gooperCondensed = localFont({
  src: '../../public/fonts/GooperCondensed7-Light-Trial.otf',
  display: 'swap',
  variable: '--font-gooper-condensed',
})

export const metadata: Metadata = {
  title: 'Yishan & Yitong Wedding',
  description: 'Wedding website for Yishan and Yitong',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={gooperCondensed.className}>
        {/* <Navigation /> */}
        {children}
        <Analytics />
      </body>
    </html>
  )
}