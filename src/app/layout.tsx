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
  title: "Yishan and Yitong's Wedding",
  description: 'Join us in celebrating the wedding of Yishan Zhang and Yitong Zhang on October 4, 2025 at Penny Roma, San Francisco. RSVP and get all the wedding details here.',
  keywords: ['Yishan Zhang', 'Yitong Zhang', 'Wedding', 'October 2025', 'San Francisco Wedding', 'Penny Roma'],
  authors: [{ name: 'Yishan & Yitong' }],
  creator: 'Yishan & Yitong',
  publisher: 'Yishan & Yitong',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yishanyitongwedding.com'), // Update this with your actual domain when available
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Yishan and Yitong's Wedding",
    description: 'Join us in celebrating our special day on October 4, 2025! RSVP and get all the wedding details here.',
    url: 'https://yishanyitongwedding.com', // Update with your actual domain
    siteName: "Yishan & Yitong's Wedding",
    images: [
      {
        url: '/img/weddingPhoto.png',
        width: 1200,
        height: 630,
        alt: 'Yishan & Yitong Wedding Photo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Yishan and Yitong's Wedding",
    description: 'Join us in celebrating our special day on October 4, 2025! RSVP and get all the wedding details here.',
    images: ['/img/weddingPhoto.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add these when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
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