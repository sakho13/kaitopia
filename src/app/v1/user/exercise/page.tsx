"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ButtonBase } from "@/components/atoms/ButtonBase"
import { PopCard } from "@/components/atoms/PopCard"
import { SectionTitle } from "@/components/atoms/SectionTitle"
import { BackButton } from "@/components/molecules/BackButton"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { useGetRecommendExercises, useGetUserExercise } from "@/hooks/useApiV1"
import { decodeBase64ForUrl } from "@/lib/functions/decodeBase64"
import { encodeBase64ForUrl } from "@/lib/functions/encodeBase64"
import { joincn } from "@/lib/functions/joincn"
import { DialogTitle } from "@radix-ui/react-dialog"

export default function Page() {
  const {
    dataToGetUserExercise,
    dataToGetRecommendExercises,
    startExercise,
    openExerciseInfoDialog,
    onOpenExerciseInfoDialog,
    onCloseExerciseInfoDialog,
  } = usePage()

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <div className='mb-6'>
        <BackButton />
      </div>

      <div>
        <SectionTitle title='おすすめの問題集' />

        <section className='mb-6 flex md:flex-row flex-col gap-x-3 gap-y-3'>
          {dataToGetRecommendExercises && dataToGetRecommendExercises.success
            ? dataToGetRecommendExercises.data.recommendExercises.map(
                (exercise) => (
                  <PopCard
                    key={encodeBase64ForUrl(exercise.id)}
                    className={joincn(`h-[160px]`)}
                    onClick={() => {
                      onOpenExerciseInfoDialog(exercise.id)
                    }}
                  >
                    <h3 className='text-lg font-bold mb-2'>{exercise.title}</h3>
                    <p className='text-sm'>{exercise.description}</p>
                  </PopCard>
                ),
              )
            : null}
        </section>
      </div>

      <Dialog
        open={openExerciseInfoDialog}
        onOpenChange={onCloseExerciseInfoDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dataToGetUserExercise?.success
                ? dataToGetUserExercise.data.exercise.title
                : "-"}
            </DialogTitle>
          </DialogHeader>

          <div>
            <section>
              <h2>説明</h2>

              <p>
                {dataToGetUserExercise?.success
                  ? dataToGetUserExercise.data.exercise.description
                  : "-"}
              </p>
            </section>

            <section>
              <h2></h2>
            </section>

            <search className='pt-4'>
              <ButtonBase
                colorMode='primary'
                sizeMode='full'
                className='py-4 font-bold'
                onClick={startExercise}
              >
                スタート！
              </ButtonBase>
            </search>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function usePage() {
  const searchParam = useSearchParams()
  const router = useRouter()

  const [exerciseId, setExerciseId] = useState<string | null>(null)

  const { dataToGetRecommendExercises } = useGetRecommendExercises()
  const { dataToGetUserExercise } = useGetUserExercise(exerciseId || "")

  useEffect(() => {
    const eid = searchParam.get("eid")
    if (eid) {
      setExerciseId(decodeBase64ForUrl(eid))
    } else {
      setExerciseId(null)
    }
  }, [searchParam])

  const startExercise = () => {
    router.push(
      `/v1/user/exercise/venue?eid=${encodeBase64ForUrl(exerciseId || "")}`,
    )
  }

  const openExerciseInfoDialog =
    useMemo(
      () =>
        exerciseId !== null &&
        dataToGetUserExercise &&
        dataToGetUserExercise.success,
      [exerciseId, dataToGetUserExercise],
    ) ?? false

  const onOpenExerciseInfoDialog = (exerciseId: string) => {
    setExerciseId(exerciseId)
  }

  const onCloseExerciseInfoDialog = () => {
    setExerciseId(null)
    router.replace("/v1/user/exercise")
  }

  return {
    dataToGetUserExercise,
    dataToGetRecommendExercises,
    startExercise,
    openExerciseInfoDialog,
    onOpenExerciseInfoDialog,
    onCloseExerciseInfoDialog,
  }
}
