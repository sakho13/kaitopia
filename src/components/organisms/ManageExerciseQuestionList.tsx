"use client"

import { Plus } from "lucide-react"
import { ApiV1OutTypeMap } from "@/lib/types/apiV1Types"
import { ButtonBase } from "../atoms/ButtonBase"
import { ManageTable } from "../molecules/ManageTable"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { ManageExerciseQuestionForm } from "../molecules/manage/ManageExerciseQuestionForm"
import { useBoolean } from "@/hooks/common/useBoolean"

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
  const { value: isDialogOpen, onChange: setDialogOpen } = useBoolean()

  return (
    <div>
      <div className='flex justify-between items-center'>
        <h2 className='text-lg font-semibold select-none'>問題を編集</h2>

        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <ButtonBase
              colorMode='primary'
              sizeMode='fit'
              className='px-4 text-sm'
            >
              <Plus size={14} strokeWidth={3} /> 問題を追加
            </ButtonBase>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>新しい問題集</DialogTitle>
            </DialogHeader>
            <ManageExerciseQuestionForm
              exerciseId={exerciseId}
              onSaved={() => {
                if (onUpdate) onUpdate()
                setDialogOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
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
    </div>
  )
}
