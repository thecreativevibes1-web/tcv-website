import type { Metadata } from 'next'
import Script from 'next/script'
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Creative Vibes — Signal Active',
  description: 'We architect the systems that make clients find you. Web Design · AI Automation · Lead Generation.',
  keywords: ['web design', 'AI automation', 'lead generation', 'marketing agency', 'India'],
  openGraph: {
    title: 'The Creative Vibes — Signal Active',
    description: 'Most businesses are invisible. We change that.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <Script
          id="clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID || ''}");
            `,
          }}
        />
      </head>
      <body style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="scanline" aria-hidden="true" />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
