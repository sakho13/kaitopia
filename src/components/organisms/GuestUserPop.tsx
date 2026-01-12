"use client"

import { Lock } from "lucide-react"
import { useUserConfigStore } from "@/hooks/stores/useUserConfigStore"

export function GuestUserPop() {
  const { config } = useUserConfigStore()

  if (config.isGuest) {
    return (
      <div className='mx-auto max-w-6xl px-4 pt-4 space-y-3'>
        <div className='relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-sky-100 to-cyan-50 p-4 sm:p-5'>
          <div className='flex items-start gap-3'>
            <div className='mt-1 inline-flex size-8 items-center justify-center rounded-full bg-white shadow-sm relative'>
              <Lock className='size-4 text-cyan-500' aria-hidden />
              <span className='pointer-events-none absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.2)_60%,transparent_70%)] animate-pulse' />
            </div>

            <div className='flex-1 select-none'>
              <p className='text-sm font-semibold flex items-center gap-2'>
                ゲストモードで体験中
              </p>
              <p className='text-sm text-slate-600'>
                登録すると学習の進捗が保存され、何回でも問題にチャレンジできます！
              </p>
            </div>
            {/* <button className='hidden sm:inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:opacity-90'>
              アカウントを作成する <ArrowRight className='size-4' aria-hidden />
            </button> */}
          </div>
        </div>
      </div>
    )
  }

  return null
}
