import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "App de Etiqueta",
  description: "Gerador de etiquetas para kits com foto, código de barras e marca.",
  manifest: "/manifest.json", // Link para o manifesto PWA
  icons: {
    icon: "/icon.png", // Link para o ícone gerado por app/icon.tsx
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
