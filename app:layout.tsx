import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Plurio — Intelligence Reports',
  description: 'Transform interview transcripts into polished intelligence reports. Powered by Plurio.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://content.plurio.ai'),
  openGraph: {
    title: 'Plurio Intelligence Reports',
    description: 'Turn any interview into a publication-ready insights report.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" />
      </head>
      <body style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>{children}</body>
    </html>
  )
}
