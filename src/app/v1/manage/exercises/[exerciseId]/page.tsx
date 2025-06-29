"use client"

import { EditableTextInputBase } from "@/components/atoms/EditableInputBase"
import { InfoArea } from "@/components/atoms/InfoArea"
import { ManageExerciseQuestionList } from "@/components/organisms/ManageExerciseQuestionList"
import { useGetManageExercise, usePatchManageExercise } from "@/hooks/useApiV1"
import { DateUtility } from "@/lib/classes/common/DateUtility"
import { decodeBase64ForUrl } from "@/lib/functions/decodeBase64"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Page() {
  const { exerciseId } = useParams()
  const decodedExerciseId =
    !exerciseId || Array.isArray(exerciseId)
      ? ""
      : decodeBase64ForUrl(exerciseId)

  const {
    dataToGetManageExercise,
    isLoadingToGetManageExercise,
    refetchManageExercise,
  } = useGetManageExercise(decodedExerciseId)
  const { requestPatchExercise } = usePatchManageExercise()

  const [title, setTitle] = useState("")
  const saveTitle = async (value: string) => {
    if (!dataToGetManageExercise?.success) return
    if (title === value) return
    setTitle(value)

    const result = await requestPatchExercise(decodedExerciseId, {
      title: value,
    })
    if (result.success) {
      refetchManageExercise()
    }
  }

  useEffect(() => {
    if (!dataToGetManageExercise?.success) return
    if (dataToGetManageExercise.data.exercise.title !== title) {
      setTitle(dataToGetManageExercise.data.exercise.title)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataToGetManageExercise])

  if (decodedExerciseId === "" || !dataToGetManageExercise?.success)
    return (
      <div>
        <p>URLに誤りがあります</p>
      </div>
    )

  if (isLoadingToGetManageExercise)
    return (
      <div className='flex justify-center items-center h-screen'>
        <p>Loading...</p>
      </div>
    )

  return (
    <div className='grid lg:grid-cols-2 md:grid-cols-1 gap-4'>
      <InfoArea colorMode='white' className='grid grid-cols-1 gap-2 h-fit'>
        <div>
          <h2 className='text-lg font-semibold select-none'>タイトル</h2>
          <EditableTextInputBase
            value={title}
            onChange={saveTitle}
            className='mt-2 px-4'
          />
        </div>

        <div>
          <h2 className='text-lg font-semibold select-none'>説明</h2>
          <p className='text-gray-600 font-medium px-4'>
            {dataToGetManageExercise?.data.exercise.description}
          </p>
        </div>

        <div className='grid grid-cols-2'>
          <div>
            <h2 className='text-lg font-semibold select-none'>問題集ID</h2>
            <p className='text-gray-600 font-medium px-4'>
              {dataToGetManageExercise?.data.exercise.exerciseId}
            </p>
          </div>
        </div>

        <div className='grid grid-cols-2'>
          <div>
            <h2 className='text-lg font-semibold select-none'>問題数</h2>
            <p className='text-gray-600 font-medium px-4'>
              {dataToGetManageExercise?.data.exercise.questionCount}問
            </p>
          </div>

          <div>
            <h2 className='text-lg font-semibold select-none'>公開状態</h2>
            <p className='text-gray-600 font-medium px-4'>
              {dataToGetManageExercise?.data.exercise.isPublished
                ? "公開中"
                : "非公開"}
            </p>
          </div>
        </div>

        <div className='grid grid-cols-2'>
          <div>
            <h2 className='text-lg font-semibold select-none'>スキップ可否</h2>
            <p className='text-gray-600 font-medium px-4'>
              {dataToGetManageExercise?.data.exercise.isCanSkip
                ? "スキップ可能"
                : "スキップ不可"}
            </p>
          </div>

          <div>
            <h2 className='text-lg font-semibold select-none'>採点方式</h2>
            <p className='text-gray-600 font-medium px-4'>
              {dataToGetManageExercise?.data.exercise.isScoringBatch
                ? "一括採点"
                : "都度採点"}
            </p>
          </div>
        </div>

        <div className='grid grid-cols-2'>
          <div>
            <h2 className='text-lg font-semibold select-none'>作成日時</h2>
            <p className='text-gray-600 font-medium px-4'>
              {DateUtility.formatDateTime(
                DateUtility.convertToLocalDate(
                  dataToGetManageExercise?.data.exercise.createdAt ?? "",
                ),
              )}
            </p>
          </div>

          <div>
            <h2 className='text-lg font-semibold select-none'>更新日時</h2>
            <p className='text-gray-600 font-medium px-4'>
              {DateUtility.formatDateTime(
                DateUtility.convertToLocalDate(
                  dataToGetManageExercise?.data.exercise.updatedAt ?? "",
                ),
              )}
            </p>
          </div>
        </div>
      </InfoArea>

      <InfoArea colorMode='white'>
        <ManageExerciseQuestionList
          exerciseId={decodedExerciseId}
          data={dataToGetManageExercise.data}
          onUpdate={refetchManageExercise}
        />
      </InfoArea>
    </div>
  )
}
