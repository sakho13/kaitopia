"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function UserPopover() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // outside click handler
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

  return (
    <div className='relative' ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className='w-10 h-10 rounded-full bg-smart flex items-center justify-center text-white hover:opacity-90'
      >
        👤
      </button>

      {open && (
        <div className='absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-50'>
          <button
            onClick={() => handleNavigate("/manage")}
            className='w-full text-text text-left px-4 py-2 hover:bg-gray-100'
          >
            管理画面
          </button>
          <button
            onClick={() => handleNavigate("/user/profile")}
            className='w-full text-text text-left px-4 py-2 hover:bg-gray-100'
          >
            ユーザ情報
          </button>
          <button
            onClick={() => {
              setOpen(false)
              // ログアウト処理（FirebaseやAuth API連携予定）
              alert("ログアウトしました")
              router.push("/login")
            }}
            className='w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500'
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  )
}
