"use client"

import { useState } from "react"
import { ButtonBase } from "../atoms/ButtonBase"
import { usePostManageExercise } from "@/hooks/useApiV1"
import { useManageStore } from "@/hooks/stores/useManageStore"
import { joincn } from "@/lib/functions/joincn"

type Props = {
  onClickButton?: () => void
}

export function ManageNewExerciseForm({ onClickButton }: Props) {
  const { schoolId } = useManageStore.getState()

  const [exerciseName, setExerciseName] = useState<string>("")
  const [exerciseError, setExerciseError] = useState<string>("")
  const { requestPostExercise } = usePostManageExercise()

  const onChangeExerciseName = (value: string) => {
    setExerciseName(value)
  }

  const createExercise = () => {
    if (!exerciseName) {
      setExerciseError("問題集名は必須です")
      return
    }
    if (exerciseName.length > 50) {
      setExerciseError("問題集名は50文字以内で入力してください")
      return
    }

    setExerciseError("")
    requestPostExercise({
      schoolId,
      property: {
        title: exerciseName,
        description: "",
      },
    }).then(() => {
      setExerciseName("")
      if (onClickButton) onClickButton()
    })
  }

  return (
    <div>
      <div>
        <label className='block text-sm font-medium mb-1'>問題集名</label>
        <input
          type='text'
          className={joincn(
            "w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary",
            exerciseError ? "border-red-500" : "border-gray-300",
          )}
          value={exerciseName}
          onChange={(e) => onChangeExerciseName(e.target.value)}
        />
        {exerciseError && (
          <p className='text-red-500 text-sm mt-1'>{exerciseError}</p>
        )}
      </div>

      <div className='mt-6 flex gap-4 justify-end'>
        <ButtonBase
          colorMode='primary'
          className='px-4 py-2'
          sizeMode='fit'
          onClick={createExercise}
        >
          保存
        </ButtonBase>
      </div>
    </div>
  )
}
