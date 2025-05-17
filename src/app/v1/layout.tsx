"use client"

import { useRouter } from "next/navigation"
import { ButtonBase } from "@/components/atoms/ButtonBase"
import { useAuth } from "@/hooks/useAuth"

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  const router = useRouter()
  const { loading, idToken } = useAuth()

  if (!loading && idToken === null) {
    return (
      <div className='flex justify-center items-center flex-col gap-y-8 h-screen'>
        <ButtonBase
          colorMode='primary'
          onClick={() => router.push("/public/login")}
        >
          ログイン画面へ
        </ButtonBase>

        <p className='text-gray-500 font-medium select-none'>
          認証に時間がかかっているか、未認証状態です。
        </p>
      </div>
    )
  }

  if (loading || idToken === null) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading...
      </div>
    )
  }

  return children
}
