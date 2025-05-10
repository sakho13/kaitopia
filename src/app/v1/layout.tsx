"use client"

import { useAuth } from "@/hooks/useAuth"

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  const { loading, idToken } = useAuth()

  if (loading || idToken === null) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading...
      </div>
    )
  }

  return children
}
