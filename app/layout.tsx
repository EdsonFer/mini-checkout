import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Checkout Cakto - Curso de Marketing Digital 2025',
  description:
    'Finalize sua compra com segurança. Pague via PIX com 0% de taxa ou cartão de credito em ate 12x.',
  robots: 'noindex, nofollow',
  icons: [
    "https://tse4.mm.bing.net/th/id/OIP.jJUL84nu6YbnpZCdCungEwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
  ],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#10b981',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
