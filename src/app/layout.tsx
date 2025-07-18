import type React from "react"
import type { Metadata } from "next"
import { Roboto_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/common/theme-provider"
import { LayoutClient } from "./layout-client"

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
})

export const metadata: Metadata = {
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
    generator: 'v0.dev'
}

/**
 * Root layout for the application.
 * Sets up the theme provider and global font.
 * @param {object} props - The properties for the component.
 * @param {React.ReactNode} props.children - The child elements to render.
 * @returns {JSX.Element} The root layout component.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // suppressHydrationWarning is required when using next-themes and to prevent
    // hydration mismatches from browser extensions (e.g., Grammarly, password managers)
    <html lang="en" suppressHydrationWarning>
      <body className={robotoMono.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange // Disable transitions on theme change to prevent flashes
        >
          <LayoutClient>{children}</LayoutClient>
        </ThemeProvider>
      </body>
    </html>
  )
}
