"use client"

import { useSearchParams } from "next/navigation"
import { AnswerLogSheet } from "@/components/organisms/AnswerLogSheet"
import { decodeBase64ForUrl } from "@/lib/functions/decodeBase64"

export default function Page() {
  const searchParams = useSearchParams()

  const rawAnswerLogSheetId = searchParams.get("answerLogSheetId")
  const answerLogSheetId = rawAnswerLogSheetId
    ? decodeBase64ForUrl(rawAnswerLogSheetId)
    : null

  if (!answerLogSheetId) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <p className='text-gray-500 font-medium'>回答記録がありません。</p>
      </div>
    )
  }

  return (
    <div>
      <AnswerLogSheet answerLogSheetId={answerLogSheetId} />
    </div>
  )
}
