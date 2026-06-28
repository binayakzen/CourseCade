import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Orbitron } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { SiteNav } from '@/components/site-nav'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Coursecade — Learn. Earn. Rank Up.',
  description:
    'Coursecade turns your YouTube course watch time into tokens and competitive gaming ranks. Level up your learning.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ebecef',
}

const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
const isClerkConfigured = pubKey && !pubKey.includes('cGxhY2Vob2xk') && pubKey.startsWith('pk_')

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const content = (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable}`}
    >
      <body className="font-sans antialiased">
        <SiteNav />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )

  if (isClerkConfigured) {
    return (
      <ClerkProvider appearance={{ baseTheme: dark }}>
        {content}
      </ClerkProvider>
    )
  }

  return content
}
