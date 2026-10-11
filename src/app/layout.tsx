import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', weight: ['300', '400', '500', '700'] });
const body = Inter({ subsets: ['latin'], variable: '--font-body', weight: ['300', '400', '500'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400', '500'] });

export const metadata: Metadata = {
  title: 'New Creation Hubs — We Create. We Build. We Grow.',
  description:
    'New Creation Hubs turns ambitious ideas into intelligent digital experiences, powerful software and businesses built for growth. Web & app development, AI products, SaaS, branding and growth marketing.',
};

export const viewport: Viewport = {
  themeColor: '#03040a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-void font-body text-warmwhite antialiased">{children}</body>
    </html>
  );
}
