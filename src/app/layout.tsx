import type { Metadata } from 'next'
import { DM_Serif_Display, Source_Sans_3 } from 'next/font/google'
import './globals.css'

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Adam Fuhriman | DevOps Engineer',
  description: 'Portfolio website showcasing 5 years of DevOps experience with Kubernetes, AWS, Terraform, and CI/CD pipelines.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${sourceSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
