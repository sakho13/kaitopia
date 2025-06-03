"use client"

import { useSelectInput } from "@/hooks/common/useSelectInput"
import { useValidateInput } from "@/hooks/common/useValidateInput"
import { usePostManageExerciseQuestion } from "@/hooks/useApiV1"
import { useToast } from "@/hooks/useToast"
import { objectKeys } from "@/lib/functions/objectKeys"
import {
  QuestionAnswerType,
  QuestionType,
} from "@/lib/types/base/questionTypes"
import { ButtonBase } from "../../atoms/ButtonBase"

type Props = (
  | {
      // 問題集から新規で作成する
      exerciseId: string
    }
  | {
      // 既存の問題を編集する
      questionId: string
    }
) & {
  // 共通のプロパティがあればここに追加
  onSaved?: () => void
}

export function ManageExerciseQuestionForm(props: Props) {
  if ("questionId" in props) {
    return <ManageExerciseQuestionFormEdit questionId={props.questionId} />
  }

  if ("exerciseId" in props) {
    return (
      <ManageExerciseQuestionFormNew
        exerciseId={props.exerciseId}
        onSaved={props.onSaved}
      />
    )
  }

  return <div>不明な状態です</div>
}

function ManageExerciseQuestionFormNew({
  exerciseId,
  onSaved,
}: {
  exerciseId: string
  onSaved?: () => void
}) {
  const { showWarn, showSuccessShort } = useToast()
  const { requestPostExerciseQuestion } = usePostManageExerciseQuestion()

  const {
    value: title,
    errorMessage: titleError,
    onChange: onChangeTitle,
  } = useValidateInput({
    initialValue: "",
    validate: (value) => {
      if (value.length < 1 || value.length > 64) {
        return "問題タイトルは1文字以上64文字以下で入力してください"
      }
      return ""
    },
  })
  const {
    selectedValue: selectedQuestionType,
    onChange: onChangeQuestionType,
  } = useSelectInput<keyof typeof QuestionType>({
    selectOptions: objectKeys(QuestionType),
    // selectOptions: ["TEXT"],
    initialValue: "TEXT",
  })
  const { selectedValue: selectedAnswerType, onChange: onChangeAnswerType } =
    useSelectInput<keyof typeof QuestionAnswerType>({
      selectOptions: objectKeys(QuestionAnswerType),
      initialValue: "SELECT",
    })

  const _saveQuestion = async () => {
    if (titleError) {
      showWarn(titleError)
      return
    }
    if (!selectedQuestionType || !selectedAnswerType) {
      showWarn("問題タイプと回答タイプを選択してください")
      return
    }

    const result = await requestPostExerciseQuestion({
      exerciseId,
      title,
      questionType: selectedQuestionType,
      answerType: selectedAnswerType,
    })

    if (!result.success) {
      showWarn("問題の作成に失敗しました")
      return
    }

    if (onSaved) {
      onSaved()
    }

    showSuccessShort("問題を作成しました！")
  }

  return (
    <div>
      <div>
        <div id='question-title'>
          <label htmlFor='title'>問題タイトル</label>
          <input
            type='text'
            id='title'
            value={title}
            onChange={(e) => onChangeTitle(e.target.value)}
            className='w-full p-2 border rounded'
          />
          {titleError && (
            <p className='text-red-500 text-sm mt-1'>{titleError}</p>
          )}
        </div>

        <div id='question-question-type' className='mt-4'>
          <label htmlFor='question-type'>問題タイプ</label>
          <select
            id='question-type'
            value={selectedQuestionType ?? "-"}
            onChange={(e) => onChangeQuestionType(e.target.value)}
            className='w-full p-2 border rounded'
          >
            {objectKeys(QuestionType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div id='question-answer-type' className='mt-4'>
          <label htmlFor='answer-type'>回答タイプ</label>
          <select
            id='answer-type'
            value={selectedAnswerType ?? "-"}
            onChange={(e) => onChangeAnswerType(e.target.value)}
            className='w-full p-2 border rounded'
          >
            {objectKeys(QuestionAnswerType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='mt-6 flex justify-end'>
        <ButtonBase onClick={_saveQuestion}>作成</ButtonBase>
      </div>
    </div>
  )
}

function ManageExerciseQuestionFormEdit({
  questionId,
}: {
  questionId: string
}) {
  return (
    <div>
      <p>未対応 {questionId}</p>
    </div>
  )
}
