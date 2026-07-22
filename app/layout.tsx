import type { Metadata } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Web3Provider } from '@/context/Web3Context'
import { ThemeProvider } from '@/context/ThemeContext'
import { ThreeDBackground } from '@/components/ThreeDBackground'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'ArcSwap - Decentralized Exchange',
  description: 'ArcSwap: Trade, earn, and explore decentralized finance on Arc Testnet',
  generator: 'v0.app',
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
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased text-foreground relative overflow-x-hidden"  style={{ background: 'transparent' }}>
        {/* Atmospheric glows - static positioning */}
        <div className="glow-cyan" aria-hidden="true" />
        <div className="glow-purple" aria-hidden="true" />
        <div className="glow-blue" aria-hidden="true" />

        <ThreeDBackground />
        <div className="relative z-10 content-wrapper">
          <ThemeProvider>
            <Web3Provider>
              {children}
            </Web3Provider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}
