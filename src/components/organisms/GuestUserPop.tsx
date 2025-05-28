"use client"

import { useUserConfigStore } from "@/hooks/stores/useUserConfigStore"

export function GuestUserPop() {
  const { config } = useUserConfigStore.getState()

  if (config.isGuest) {
    return (
      <div
        id='guest-user-pop'
        className='bg-yellow-100 text-yellow-800 p-4 text-center'
      >
        <p className='select-none'>
          <span>ゲストでログイン中</span>&nbsp;
          <span className='font-semibold'>機能が制限されています</span>
        </p>
      </div>
    )
  }

  return null
}
