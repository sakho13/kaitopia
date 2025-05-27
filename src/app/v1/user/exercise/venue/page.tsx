"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ExerciseManager } from "@/components/organisms/ExerciseManager"
import { decodeBase64ForUrl } from "@/lib/functions/decodeBase64"
import { Skeleton } from "@/components/ui/skeleton"

export default function ExerciseAnswerPage() {
  const searchParam = useSearchParams()

  const [exerciseId, setExerciseId] = useState<string | null>(null)

  useEffect(() => {
    const eid = searchParam.get("eid")
    if (eid) {
      setExerciseId(decodeBase64ForUrl(eid))
    } else {
      setExerciseId(null)
    }
  }, [searchParam])

  if (exerciseId === null) return <Skeleton className='w-full h-[400px]' />

  return (
    <div className='min-h-screen bg-kaitopia-background text-kaitopia-text py-8 md:p-8 font-sans'>
      <ExerciseManager exerciseId={exerciseId} />
    </div>
  )
}
