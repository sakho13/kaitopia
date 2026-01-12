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
      <head>
        <link
          rel='stylesheet'
          href='https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.css'
          integrity='sha384-o3WH+1yEhq+grOgz1BVYTZPyTlMXrDxnjN1By9/ba94JqJhva6wFm2Hb+URQX53v'
          crossOrigin='anonymous'
        />
        <script
          defer
          src='https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.js'
          integrity='sha384-C5yZTsgLOfuizO9kb+hrB8uSBwwvZ4yenKWU0KmWl+7bkL6Tph/KbcOa3S4zdoRE'
          crossOrigin='anonymous'
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-mono`}
      >
        {/* SVG defs for gooey effects (SlimeButton) */}
        <svg width='0' height='0' className='absolute' aria-hidden>
          <defs>
            <filter id='goo'>
              <feGaussianBlur
                in='SourceGraphic'
                stdDeviation='6'
                result='blur'
              />
              <feColorMatrix
                in='blur'
                mode='matrix'
                values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7'
                result='goo'
              />
              <feBlend in='SourceGraphic' in2='goo' />
            </filter>
          </defs>
        </svg>

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
