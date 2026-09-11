import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import WipeProvider from './components/WipeProvider'

export const metadata: Metadata = {
  metadataBase: new URL('https://vikram-varkoor.vercel.app'),
  title: 'Vikram Varkoor',
  description: 'EE Graduate building AI pipelines, data systems, and hardware platforms. IEEE Published. Production deployed.',
  openGraph: {
    title: 'Vikram Varkoor, Portfolio',
    description: 'EE Graduate building AI pipelines, data systems, and hardware platforms. IEEE Published. Production deployed.',
    url: 'https://vikram-varkoor.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vikram Varkoor',
    description: 'EE Graduate building AI pipelines, data systems, and hardware platforms.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <WipeProvider>{children}</WipeProvider>
        <Analytics />
      </body>
    </html>
  )
}
