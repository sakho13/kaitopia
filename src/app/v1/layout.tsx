"use client"

import { useAuth } from "@/hooks/useAuth"

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading...
      </div>
    )
  }

  return children
}
