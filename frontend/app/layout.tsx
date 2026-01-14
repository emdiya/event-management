import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { Poppins, Kantumruy_Pro } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ReduxProvider } from "./providers"
import "./globals.css"

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins"
})

const kantumruyPro = Kantumruy_Pro({ 
  subsets: ["khmer", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kantumruy"
})

export const metadata: Metadata = {
  title: "KD-Event - កិច្ចប្រជុំ សន្និសីទ សិក្ខាសាលា",
  description: "Meeting, Conference & Workshop Management System | ប្រព័ន្ធគ្រប់គ្រងកិច្ចប្រជុំ សន្និសីទ និងសិក្ខាសាលា",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${kantumruyPro.variable} font-sans antialiased`}>
        <ReduxProvider>{children}</ReduxProvider>
        <Analytics />
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </body>
    </html>
  )
}
