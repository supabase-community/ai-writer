import { Noto_Serif_Display } from "next/font/google"
import { GeistSans } from "geist/font/sans"

import "./globals.css"

import { cn } from "@/lib/utils"
import EntryProvider from "@/components/EntryProvider"
import Layout from "@/components/Layout"
import ThemeProvider from "@/components/ThemeProvider"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000"

const notoSerifDisplay = Noto_Serif_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-serif-display",
})

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase AI Writer Starter Kit",
  description: "Clean af writing app with AI autocomplete",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <EntryProvider>
            <main
              className={cn(
                notoSerifDisplay.variable,
                "h-dvh items-center font-sans subpixel-antialiased"
              )}
            >
              <Layout>{children}</Layout>
            </main>
          </EntryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
