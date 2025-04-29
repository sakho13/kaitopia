"use client"

import { Undo } from "lucide-react"
import { useRouter } from "next/navigation"
import { ButtonBase } from "../atoms/ButtonBase"

type Props = {
  onBackCallback?: () => void
}

export function BackButton({ onBackCallback }: Props) {
  const router = useRouter()

  const onBack = () => {
    if (onBackCallback) {
      onBackCallback()
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
