"use client"

import { ButtonBase } from "@/components/atoms/ButtonBase"
import { EditableTextInputBase } from "@/components/atoms/EditableInputBase"
import { InfoArea } from "@/components/atoms/InfoArea"
import { ManageTable } from "@/components/molecules/ManageTable"
import { useGetManageExercise, usePatchManageExercise } from "@/hooks/useApiV1"
import { DateUtility } from "@/lib/classes/common/DateUtility"
import { decodeBase64ForUrl } from "@/lib/functions/decodeBase64"
import { Plus } from "lucide-react"
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
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-semibold select-none'>問題を編集</h2>

          <ButtonBase
            colorMode='primary'
            sizeMode='fit'
            className='px-4 text-sm'
          >
            <Plus size={14} strokeWidth={3} /> 問題を追加
          </ButtonBase>
        </div>

        <div className='px-2 mt-2'>
          <ManageTable
            header={[
              { id: "index", label: "" },
              { id: "name", label: "問題名" },
              { id: "currentVersion", label: "アクティブ ver" },
              { id: "draftVersion", label: "編集中" },
            ]}
            value={dataToGetManageExercise.data.questions}
            renderBodyCell={(rowIndex, item, header) => {
              if (header.id === "index") {
                return (
                  <td
                    key={`${exerciseId}-${rowIndex}-${header.id}`}
                    className='px-1 py-2 text-center select-none'
                  >
                    {rowIndex + 1}
                  </td>
                )
              } else if (header.id === "name") {
                return (
                  <td
                    key={`${exerciseId}-${rowIndex}-${header.id}`}
                    className='px-4 py-2'
                  >
                    {item.title}
                  </td>
                )
              } else if (header.id === "currentVersion") {
                return (
                  <td
                    key={`${exerciseId}-${rowIndex}-${header.id}`}
                    className='px-4 py-2 text-center'
                  >
                    {item.currentVersion}
                  </td>
                )
              } else if (header.id === "draftVersion") {
                return (
                  <td
                    key={`${exerciseId}-${rowIndex}-${header.id}`}
                    className='px-4 py-2 text-center'
                  >
                    {item.draftVersion ?? ""}
                  </td>
                )
              }
            }}
          />
        </div>
      </InfoArea>
    </div>
  )
}
