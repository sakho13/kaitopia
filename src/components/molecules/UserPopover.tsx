"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { handleLogoutByFirebase } from "@/lib/functions/firebaseActions"

export default function UserPopover() {
  const { open, ref, handleNavigate, signOut, toggleOpen } = useUserPopover()

  return (
    <div className='relative' ref={ref}>
      <button
        onClick={toggleOpen}
        className='w-10 h-10 rounded-full bg-smart flex items-center justify-center text-white hover:opacity-90 hover:cursor-pointer'
      >
        👤
      </button>

      {open && (
        <div className='absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-50'>
          {/* <button
            onClick={() => handleNavigate("/v1/manage")}
            className='w-full text-text text-left px-4 py-2 hover:bg-gray-100'
          >
            管理画面
          </button> */}
          <button
            onClick={() => handleNavigate("/v1/user/profile")}
            className='w-full text-text text-left px-4 py-2 hover:bg-gray-100'
          >
            ユーザ情報
          </button>

          <button
            onClick={signOut}
            className='w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500'
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  )
}

function useUserPopover() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleNavigate = (path: string) => {
    setOpen(false)
    router.push(path)
  }

  const signOut = () => {
    handleLogoutByFirebase()
    setOpen(false)
    router.push("/public/login")
  }

  const toggleOpen = () => {
    setOpen((prev) => !prev)
  }

  return { open, ref, handleNavigate, signOut, toggleOpen }
}
