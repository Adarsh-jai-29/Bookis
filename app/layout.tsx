import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Navbar } from "@/components/layout/navbar"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "BOOKish - Buy & Sell Books Online",
  description: "The ultimate marketplace for buying and selling books. Find rare books, textbooks, and bestsellers.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
