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
import {
  useDeleteManageExercise,
  useGetManageExercises,
} from "@/hooks/useApiV1"
import { useManageStore } from "@/hooks/stores/useManageStore"
import { encodeBase64ForUrl } from "@/lib/functions/encodeBase64"
import { ManageNewExerciseForm } from "@/components/molecules/ManageNewExerciseForm"
import { DateUtility } from "@/lib/classes/common/DateUtility"
import { joincn } from "@/lib/functions/joincn"
import { Pencil, Plus, Trash2 } from "lucide-react"

export default function Page() {
  const router = useRouter()
  const { schoolId } = useManageStore()

  const [openNewExerciseDialog, setOpenNewExerciseDialog] = useState(false)
  const [openDeleteExerciseDialog, setOpenDeleteExerciseDialog] = useState<
    string | null
  >(null)
  const [deleteConfirm, setDeleteConfirm] = useState("")

  const {
    dataTooGetManageExercises,
    totalCountToGetManageExercises,
    isLoadingToGetManageExercises,
    loadMoreToGetManageExercises,
    refetchManageExercises,
  } = useGetManageExercises(schoolId)
  const { requestDeleteExercise } = useDeleteManageExercise()

  const deleteExercise = async () => {
    if (!openDeleteExerciseDialog) return
    if (deleteConfirm !== "delete") return

    await requestDeleteExercise(openDeleteExerciseDialog)
    refetchManageExercises()
    setDeleteConfirm("")
    setOpenDeleteExerciseDialog(null)
  }

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
                <Plus size={16} strokeWidth={3} />
                新しい問題集を作成
              </ButtonBase>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新しい問題集</DialogTitle>
              </DialogHeader>

              <ManageNewExerciseForm
                onClickButton={() => {
                  refetchManageExercises()
                  setOpenNewExerciseDialog(false)
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <table className='w-full bg-white shadow rounded-xl overflow-hidden'>
          <thead className='bg-background-subtle text-left text-sm'>
            <tr>
              <th className='py-2'></th>
              <th className='px-4 py-2 text-center'>タイトル</th>
              <th className='px-4 py-2 text-center'>問題数</th>
              <th className='px-4 py-2 text-center'>作成日</th>
              <th className='px-4 py-2 text-center'>更新日</th>
              <th className='px-4 py-2 text-center'>操作</th>
            </tr>
          </thead>

          <tbody>
            {dataTooGetManageExercises.map((exercise, i) => (
              <tr
                key={encodeBase64ForUrl(exercise.exerciseId)}
                className='border-t hover:bg-gray-50'
              >
                <td className='px-1 py-2 text-center select-none'>{i + 1}</td>
                <td className='px-4 py-2'>{exercise.title}</td>
                <td className='px-4 py-2 text-center'>
                  {exercise.questionCount} 問
                </td>
                <td className='px-4 py-2 text-center'>
                  {DateUtility.formatDateTime(
                    DateUtility.convertToLocalDate(exercise.createdAt ?? ""),
                  )}
                </td>
                <td className='px-4 py-2 text-center'>
                  {DateUtility.formatDateTime(
                    DateUtility.convertToLocalDate(exercise.updatedAt ?? ""),
                  )}
                </td>

                <td className='px-4 py-2 space-x-2 text-sm flex text-center'>
                  <ButtonBase
                    sizeMode='fit'
                    colorMode='primary'
                    className='px-4 py-2'
                    onClick={() =>
                      router.push(
                        `/v1/manage/exercises/${encodeBase64ForUrl(
                          exercise.exerciseId,
                        )}`,
                      )
                    }
                  >
                    <Pencil size={16} strokeWidth={3} />
                  </ButtonBase>

                  <ButtonBase
                    colorMode='danger'
                    className='px-4 py-2'
                    onClick={() => {
                      setOpenDeleteExerciseDialog(exercise.exerciseId)
                    }}
                  >
                    <Trash2 size={16} strokeWidth={3} />
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

        <Dialog
          open={openDeleteExerciseDialog !== null}
          defaultOpen={false}
          onOpenChange={(v) => {
            if (!v) setOpenDeleteExerciseDialog(null)
            setDeleteConfirm("")
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>問題集を削除します</DialogTitle>
            </DialogHeader>

            <div>
              <div className='px-4'>
                <div className='text-gray-600 font-medium mb-2'>
                  <p>一度削除すると、戻すことができません。</p>
                  <p>削除するには「delete」と入力してください。</p>
                </div>

                <div className='flex flex-col gap-4'>
                  <input
                    type='text'
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    className={joincn(
                      "w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary",
                      "border-gray-300",
                    )}
                    placeholder='delete'
                  />

                  <ButtonBase
                    sizeMode='full'
                    colorMode={deleteConfirm !== "delete" ? "ghost" : "danger"}
                    disabled={deleteConfirm !== "delete"}
                    disableHover={deleteConfirm !== "delete"}
                    onClick={deleteExercise}
                    className={"px-4"}
                  >
                    <Trash2 size={16} strokeWidth={3} />
                    削除します
                  </ButtonBase>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
