import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ToastContainer, Slide } from "react-toastify"
import { FirebaseAnalytics } from "@/components/molecules/FirebaseAnalytics"
import "./globals.css"
import { Suspense } from "react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Kaitopia",
  description: "テスト練習を簡単に",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ja'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-mono`}
      >
        <Suspense fallback={null}>
          <FirebaseAnalytics />
        </Suspense>

        {children}

        <ToastContainer
          position='bottom-right'
          closeOnClick
          rtl={false}
          autoClose={5000}
          transition={Slide}
        />
      </body>
    </html>
  )
}
