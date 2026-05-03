import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vikram Varkoor',
  description: 'EE Graduate building AI pipelines, data systems, and hardware platforms. IEEE Published. Production deployed.',
  openGraph: {
    title: 'Vikram Varkoor — Portfolio',
    description: 'EE Graduate building AI pipelines, data systems, and hardware platforms. IEEE Published. Production deployed.',
    url: 'https://vikram-varkoor.vercel.app',
    images: [
      {
        url: '/avatar.jpg',
        width: 400,
        height: 400,
        alt: 'Vikram Varkoor',
      }
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Vikram Varkoor',
    description: 'EE Graduate building AI pipelines, data systems, and hardware platforms.',
    images: ['/avatar.jpg'],
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}