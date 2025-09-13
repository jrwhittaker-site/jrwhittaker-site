import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Jonathan R Whittaker — Director · Producer · Educator',
  description: 'Docuseries, VR/3D, global workshops, simulations.',
  metadataBase: new URL('https://jrwhittaker.co'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
