"use client"

import { UserLayoutSection } from "../molecules/UserLayoutSection"
import { encodeBase64 } from "@/lib/functions/encodeBase64"
import { joincn } from "@/lib/functions/joincn"
import { useRouter } from "next/navigation"
import { useGetRecommendExercises } from "@/hooks/useApiV1"
import { InfoArea } from "../atoms/InfoArea"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"

export function UserRecommendExerciseSection() {
  const router = useRouter()
  const { dataTooGetRecommendExercises } = useGetRecommendExercises()

  return (
    <UserLayoutSection
      title='おすすめの問題集'
      action={
        <button
          className='text-sm text-primary hover:text-primary-hover font-bold cursor-pointer'
          onClick={() => router.push(`/v1/user/exercise`)}
        >
          もっと見る
        </button>
      }
    >
      <div className='w-full'>
        <Carousel className='w-full '>
          <CarouselContent>
            {dataTooGetRecommendExercises?.success
              ? dataTooGetRecommendExercises.data.recommendExercises.map(
                  (exercise) => (
                    <CarouselItem
                      key={encodeBase64(exercise.id)}
                      className='md:basis-1/3'
                    >
                      <InfoArea
                        className={joincn(
                          `bg-background-subtle p-4 rounded-2xl shadow h-[160px]`,
                          `hover:shadow-lg transition`,
                          `cursor-pointer`,
                        )}
                        onClick={() =>
                          router.push(
                            `/v1/user/exercise?eid=${encodeBase64(
                              exercise.id,
                            )}`,
                          )
                        }
                      >
                        <h3 className='text-lg font-bold mb-2'>
                          {exercise.title}
                        </h3>
                        <p className='text-sm'>{exercise.description}</p>
                      </InfoArea>
                    </CarouselItem>
                  ),
                )
              : null}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </UserLayoutSection>
  )
}
