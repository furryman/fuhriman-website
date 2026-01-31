import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fuhriman | DevOps Engineer',
  description: 'Portfolio website showcasing 5 years of DevOps experience with Kubernetes, AWS, Terraform, and CI/CD pipelines.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
