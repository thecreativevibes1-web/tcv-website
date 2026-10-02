import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider'
import './globals.css'
import '@/components/sections/ServicesOfferEngine.css'
import '@/components/sections/ProjectBriefEngine.css'
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })
export const metadata: Metadata = { title: 'New Creation Hubs — We Create. We Build. We Grow.', description: 'New Creation Hubs turns ambitious ideas into brands, digital products, AI systems and scalable businesses.', openGraph: { title: 'New Creation Hubs', description: 'We Create. We Build. We Grow.', type: 'website' } }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className={`${geist.variable} ${mono.variable}`}><body><SmoothScrollProvider>{children}</SmoothScrollProvider></body></html> }