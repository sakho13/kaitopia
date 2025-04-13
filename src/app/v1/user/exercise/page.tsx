"use client"

import { InfoArea } from "@/components/atoms/InfoArea"
import { SectionTitle } from "@/components/atoms/SectionTitle"
import { useGetRecommendExercises } from "@/hooks/useApiV1"
import { encodeBase64 } from "@/lib/functions/encodeBase64"
import { joincn } from "@/lib/functions/joincn"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Page() {
  const router = useRouter()
  const param = useParams<{ eid?: string }>()

  const { dataTooGetRecommendExercises } = useGetRecommendExercises()

  useEffect(() => {
    //
  }, [param.eid])

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <SectionTitle title='おすすめの問題集' />

      <section className='mb-6 flex gap-x-3'>
        {dataTooGetRecommendExercises && dataTooGetRecommendExercises.success
          ? dataTooGetRecommendExercises.data.recommendExercises.map(
              (exercise) => (
                <InfoArea
                  key={encodeBase64(exercise.id)}
                  className={joincn(
                    `bg-background-subtle p-4 rounded-2xl shadow w-[300px]`,
                    `hover:shadow-lg transition`,
                    `cursor-pointer`,
                  )}
                  onClick={() =>
                    router.push(
                      `/v1/user/exercise/venue?eid=${encodeBase64(
                        exercise.id,
                      )}`,
                    )
                  }
                >
                  <h3 className='text-lg font-bold mb-2'>{exercise.title}</h3>
                  <p className='text-sm'>{exercise.description}</p>
                </InfoArea>
              ),
            )
          : null}
      </section>
    </div>
  )
}
