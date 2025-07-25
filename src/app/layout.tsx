import type React from "react"
import type { Metadata } from "next"
import { Roboto_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/common/theme/theme-provider"
import { LayoutClient } from "./layout-client"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "Madhav Lodha - Software Engineer",
  description: "Portfolio of Madhav Lodha, a full-stack engineer specializing in modern web technologies.",
  icons: {
    icon: [
      {
        url: "/assets/portfolio/avatar-logo.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/assets/portfolio/avatar-logo.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: {
      url: "/assets/portfolio/avatar-logo.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
  openGraph: {
    title: "Madhav Lodha - Software Engineer",
    description: "Portfolio of Madhav Lodha, a full-stack engineer specializing in modern web technologies.",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: "Madhav Lodha Portfolio",
    images: [
      {
        url: "/assets/portfolio/avatar-logo.png",
        width: 1200,
        height: 630,
        alt: "Madhav Lodha",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Madhav Lodha - Software Engineer",
    description: "Portfolio of Madhav Lodha, a full-stack engineer specializing in modern web technologies.",
    images: ["/assets/portfolio/avatar-logo.png"],
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Prevents hydration mismatches from next-themes and browser extensions
    <html lang="en" suppressHydrationWarning>
      <body className={robotoMono.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutClient>{children}</LayoutClient>
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
