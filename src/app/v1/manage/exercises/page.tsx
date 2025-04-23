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
import { ApiV1OutTypeMap } from "@/lib/types/apiV1Types"
import { encodeBase64 } from "@/lib/functions/encodeBase64"
import { ManageNewExerciseForm } from "@/components/molecules/ManageNewExerciseForm"

export default function Page() {
  const router = useRouter()
  const { schoolId } = useManageStore.getState()

  const [openNewExerciseDialog, setOpenNewExerciseDialog] = useState(false)

  const {} = useGetManageExercises(schoolId)

  const [exercises, _setExercises] = useState<
    ApiV1OutTypeMap["GetManageExercises"]["exercises"]
  >([])

  return (
    <div>
      <div className='max-w-5xl mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-lg font-semibold'>登録済みの問題集</h3>

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
              <th className='px-4 py-2'>操作</th>
            </tr>
          </thead>

          <tbody>
            {exercises.map((exercise) => (
              <tr key={encodeBase64(exercise.exerciseId)} className='border-t'>
                <td className='px-4 py-2'>{exercise.title}</td>
                <td className='px-4 py-2'>{exercise.questionCount} 問</td>
                <td className='px-4 py-2'>{exercise.createdAt}</td>
                <td className='px-4 py-2 space-x-2 text-sm'>
                  <button
                    onClick={() =>
                      router.push(`/v1/manage/${exercise.exerciseId}/edit`)
                    }
                    className='text-primary hover:underline'
                  >
                    編集
                  </button>
                  <button className='text-red-500 hover:underline'>削除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
