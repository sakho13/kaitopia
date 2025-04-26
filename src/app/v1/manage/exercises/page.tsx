"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ButtonBase } from "@/components/atoms/ButtonBase"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useGetManageExercises } from "@/hooks/useApiV1"
import { useManageStore } from "@/hooks/stores/useManageStore"
import { encodeBase64 } from "@/lib/functions/encodeBase64"
import { ManageNewExerciseForm } from "@/components/molecules/ManageNewExerciseForm"
import { DateUtility } from "@/lib/classes/common/DateUtility"

export default function Page() {
  const router = useRouter()
  const { schoolId } = useManageStore.getState()

  const [openNewExerciseDialog, setOpenNewExerciseDialog] = useState(false)

  const {
    dataTooGetManageExercises,
    totalCountToGetManageExercises,
    isLoadingToGetManageExercises,
    loadMoreToGetManageExercises,
  } = useGetManageExercises(schoolId)

  return (
    <div>
      <div className='max-w-5xl mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-lg font-semibold select-none'>
            登録済みの問題集{" "}
            <span className='text-gray-600 font-medium'>
              {totalCountToGetManageExercises}件
            </span>
          </h3>

          <Dialog
            open={openNewExerciseDialog}
            onOpenChange={setOpenNewExerciseDialog}
          >
            <DialogTrigger asChild>
              <ButtonBase colorMode='smart' className='px-4 py-2'>
                新しい問題集を作成
              </ButtonBase>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新しい問題集</DialogTitle>
              </DialogHeader>

              <ManageNewExerciseForm
                onClickButton={() => {
                  setOpenNewExerciseDialog(false)
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <table className='w-full bg-white shadow rounded-xl overflow-hidden'>
          <thead className='bg-background-subtle text-left text-sm'>
            <tr>
              <th className='px-4 py-2'>タイトル</th>
              <th className='px-4 py-2'>問題数</th>
              <th className='px-4 py-2'>作成日</th>
              <th className='px-4 py-2'>更新日</th>
              <th className='px-4 py-2'>操作</th>
            </tr>
          </thead>

          <tbody>
            {dataTooGetManageExercises.map((exercise) => (
              <tr key={encodeBase64(exercise.exerciseId)} className='border-t'>
                <td className='px-4 py-2'>{exercise.title}</td>
                <td className='px-4 py-2'>{exercise.questionCount} 問</td>
                <td className='px-4 py-2'>
                  {DateUtility.formatDateTime(
                    DateUtility.convertToLocalDate(exercise.createdAt ?? ""),
                  )}
                </td>
                <td className='px-4 py-2'>
                  {DateUtility.formatDateTime(
                    DateUtility.convertToLocalDate(exercise.updatedAt ?? ""),
                  )}
                </td>

                <td className='px-4 py-2 space-x-2 text-sm flex'>
                  <ButtonBase
                    sizeMode='fit'
                    colorMode='primary'
                    className='px-4 py-2'
                    onClick={() =>
                      router.push(
                        `/v1/manage/exercises/${encodeURIComponent(
                          encodeBase64(exercise.exerciseId),
                        )}`,
                      )
                    }
                  >
                    詳細
                  </ButtonBase>

                  <ButtonBase colorMode='danger' className='px-4 py-2'>
                    削除
                  </ButtonBase>
                </td>
              </tr>
            ))}

            <tr className='py-8 text-center'>
              <td colSpan={4} className='px-4 py-2'>
                {totalCountToGetManageExercises === 0 ? (
                  <span className='select-none'>
                    登録された問題集はありません
                  </span>
                ) : (
                  <button
                    onClick={loadMoreToGetManageExercises}
                    disabled={isLoadingToGetManageExercises}
                  >
                    {isLoadingToGetManageExercises
                      ? "読み込み中..."
                      : "さらに読み込む"}
                  </button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
