"use client"

import { Undo } from "lucide-react"
import { useRouter } from "next/navigation"
import { ButtonBase } from "../atoms/ButtonBase"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

type Props = {
  onBackCallback?: () => void
  to?: (router: AppRouterInstance) => void
}

export function BackButton({ onBackCallback, to }: Props) {
  const router = useRouter()

  const onBack = () => {
    if (onBackCallback) {
      onBackCallback()
    }

    if (to) {
      to(router)
      return
    }
    router.back()
  }

  return (
    <ButtonBase colorMode='ghost' className='px-4' onClick={onBack}>
      <Undo />
      戻る
    </ButtonBase>
  )
}
