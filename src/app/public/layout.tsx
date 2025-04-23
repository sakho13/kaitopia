"use client"

import { useAuth } from "@/hooks/useAuth"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
  const { idToken, signOut } = useAuth()
  const [loading, setLoading] = useState(true)
  const [timerDone, setTimerDone] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimerDone(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (timerDone && idToken) {
      if (idToken) redirect("/v1/user")
    } else {
      signOut()
    }
    setLoading(false)
  }, [idToken, timerDone, signOut])

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-background'>
        <div className='loader'>Loading...</div>
      </div>
    )
  }

  return children
}
