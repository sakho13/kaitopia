"use client"

import { Plus } from "lucide-react"
import { ApiV1OutTypeMap } from "@/lib/types/apiV1Types"
import { ButtonBase } from "../atoms/ButtonBase"
import { ManageTable } from "../molecules/ManageTable"
import { ManageExerciseQuestionForm } from "../molecules/manage/ManageExerciseQuestionForm"
import { useBoolean } from "@/hooks/common/useBoolean"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"
import { usePatchManageQuestionVersion } from "@/hooks/useApiV1"
import { useToast } from "@/hooks/useToast"
import { useState } from "react"

type Props = {
  exerciseId: string
  data: ApiV1OutTypeMap["GetManageExercise"]
  onUpdate?: () => void
}

export function ManageExerciseQuestionList({
  exerciseId,
  data,
  onUpdate,
}: Props) {
  const { showError, showSuccessShort } = useToast()
  const { value: isDialogOpen, onChange: setDialogOpen } = useBoolean()
  const [editQuestionId, setEditQuestionId] = useState<string | null>(null)

  const { requestPatchQuestionVersion } = usePatchManageQuestionVersion()

  const updateCurrentVersion = async (questionId: string, value: unknown) => {
    if (value === "-") {
      showError("公開されているためバージョンを未選択に戻すことはできません")
      return
    }

    const newVersion = Number(value)
    const q = data.questions.find((q) => q.questionId === questionId)!
    if (isNaN(newVersion)) return
    if (q.currentVersion === newVersion) {
      showError("選択されたバージョンはすでにアクティブです")
      return
    }

    const updateResult = await requestPatchQuestionVersion(questionId, {
      questionId,
      version: newVersion,
    })
    if (!updateResult.success) {
      showError("問題のバージョン更新に失敗しました")
      return
    }

    showSuccessShort("問題のバージョンを更新しました")
    if (onUpdate) onUpdate()
  }

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setEditQuestionId(null)
    }
    setDialogOpen(open)
  }

  const onEditQuestion = (questionId: string) => {
    setEditQuestionId(questionId)
    setDialogOpen(true)
  }

  return (
    <div>
      <div className='flex justify-between items-center'>
        <h2 className='text-lg font-semibold select-none'>問題を編集</h2>

        <Sheet open={isDialogOpen} onOpenChange={onOpenChange}>
          <SheetTrigger asChild>
            <ButtonBase
              colorMode='primary'
              sizeMode='fit'
              className='px-4 text-sm'
            >
              <Plus size={14} strokeWidth={3} /> 問題を追加
            </ButtonBase>
          </SheetTrigger>

          <SheetContent className='w-[800px]'>
            <SheetHeader>
              <SheetTitle>新しい問題</SheetTitle>
            </SheetHeader>

            <div className='h-[80vh] overflow-y-scroll px-4'>
              {editQuestionId ? (
                <ManageExerciseQuestionForm
                  questionId={editQuestionId}
                  onSaved={() => {
                    if (onUpdate) onUpdate()
                    setDialogOpen(false)
                  }}
                />
              ) : (
                <ManageExerciseQuestionForm
                  exerciseId={exerciseId}
                  onSaved={() => {
                    if (onUpdate) onUpdate()
                    setDialogOpen(false)
                  }}
                />
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className='px-2 mt-2'>
        <ManageTable
          header={[
            { id: "index", label: "" },
            { id: "name", label: "問題名" },
            { id: "currentVersion", label: "アクティブ ver" },
            { id: "draftVersion", label: "編集中" },
          ]}
          value={data.questions}
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
                  className='px-4 py-2 cursor-pointer select-none'
                  onClick={() => {
                    onEditQuestion(item.questionId)
                  }}
                >
                  {item.title}
                </td>
              )
            } else if (header.id === "currentVersion") {
              if (item.versions.length === 0) {
                return (
                  <td
                    key={`${exerciseId}-${rowIndex}-${header.id}`}
                    className='px-4 py-2 text-center'
                  >
                    -
                  </td>
                )
              }

              return (
                <td
                  key={`${exerciseId}-${rowIndex}-${header.id}`}
                  className='px-4 py-2 text-center'
                >
                  <select
                    value={
                      item.currentVersion === null ? "-" : item.currentVersion
                    }
                    onChange={(e) => {
                      updateCurrentVersion(item.questionId, e.target.value)
                    }}
                  >
                    <option value='-'>未選択</option>

                    {item.versions.map((version) => (
                      <option
                        key={`${exerciseId}-${rowIndex}-${header.id}-${version}`}
                        value={version}
                      >
                        {version}
                      </option>
                    ))}
                  </select>
                </td>
              )
            } else if (header.id === "draftVersion") {
              return (
                <td
                  key={`${exerciseId}-${rowIndex}-${header.id}`}
                  className='px-4 py-2 text-center'
                >
                  {item.draftVersion ?? "-"}
                </td>
              )
            }
          }}
        />
      </div>
    </div>
  )
}
