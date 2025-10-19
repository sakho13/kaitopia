"use client"

import { useRouter } from "next/navigation"
import { PopCard } from "@/components/atoms/PopCard"
import { UserLayoutSection } from "@/components/molecules/UserLayoutSection"
import { encodeBase64ForUrl } from "@/lib/functions/encodeBase64"
import { joincn } from "@/lib/functions/joincn"
import { useGetRecommendExercises } from "@/hooks/useApiV1"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"

export function UserRecommendExerciseSection() {
  const router = useRouter()
  const { dataToGetRecommendExercises } = useGetRecommendExercises()

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
            {dataToGetRecommendExercises?.success
              ? dataToGetRecommendExercises.data.recommendExercises.map(
                  (exercise) => (
                    <CarouselItem
                      key={encodeBase64ForUrl(exercise.id)}
                      className='md:basis-1/3'
                    >
                      <PopCard
                        className={joincn(
                          `bg-background-subtle p-4 rounded-2xl shadow h-[160px]`,
                          `hover:shadow-lg transition`,
                          `cursor-pointer`,
                        )}
                        onClick={() =>
                          router.push(
                            `/v1/user/exercise?eid=${encodeBase64ForUrl(
                              exercise.id,
                            )}`,
                          )
                        }
                      >
                        <h3 className='text-lg font-bold mb-2'>
                          {exercise.title}
                        </h3>
                        <p className='text-sm'>{exercise.description}</p>
                      </PopCard>
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
