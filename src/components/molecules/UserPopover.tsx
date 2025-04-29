"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserConfigStore } from "@/hooks/stores/useUserConfigStore"
import { useAuth } from "@/hooks/useAuth"
import { UserRound } from "lucide-react"
import { joincn } from "@/lib/functions/joincn"

export default function UserPopover() {
  const { open, ref, handleNavigate, signOut, toggleOpen, userConfig } =
    useUserPopover()

  return (
    <div className='relative' ref={ref}>
      <button
        onClick={toggleOpen}
        className={joincn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          "bg-smart hover:bg-smart-hover",
          "text-text-on-color",
          "hover:cursor-pointer",
        )}
      >
        <UserRound strokeWidth={3} />
      </button>

      {open && (
        <div className='absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-50 transition-all'>
          {userConfig.canAccessManagePage ? (
            <button
              onClick={() => handleNavigate("/v1/manage")}
              className='w-full text-text text-left px-4 py-2 hover:bg-gray-100 transition'
            >
              管理画面
            </button>
          ) : null}

          <button
            onClick={() => handleNavigate("/v1/user/profile")}
            className='w-full text-text text-left px-4 py-2 hover:bg-gray-100 transition'
          >
            ユーザ情報
          </button>

          <button
            onClick={signOut}
            className='w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 transition'
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  )
}

function useUserPopover() {
  const { signOut: handleSignOut } = useAuth()
  const { config: userConfig } = useUserConfigStore.getState()

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
    handleSignOut()
    setOpen(false)
    router.push("/public/login")
  }

  const toggleOpen = () => {
    setOpen((prev) => !prev)
  }

  return { open, ref, handleNavigate, signOut, toggleOpen, userConfig }
}
