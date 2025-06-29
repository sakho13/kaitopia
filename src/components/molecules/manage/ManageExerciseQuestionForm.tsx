"use client"

import { useEffect } from "react"
import { CircleIcon, XIcon } from "lucide-react"
import { useSelectInput } from "@/hooks/common/useSelectInput"
import { useValidateInput } from "@/hooks/common/useValidateInput"
import {
  useGetManageQuestion,
  usePostManageExerciseQuestion,
} from "@/hooks/useApiV1"
import { useToast } from "@/hooks/useToast"
import { objectKeys } from "@/lib/functions/objectKeys"
import {
  QuestionAnswerPropertyEdit,
  QuestionAnswerType,
  QuestionType,
} from "@/lib/types/base/questionTypes"
import { ButtonBase } from "../../atoms/ButtonBase"
import { IgnoreKeysObject } from "@/lib/types/common/IgnoreKeysObject"
import { useObjectList } from "@/hooks/common/useObjectList"
import { STATICS } from "@/lib/statics"
import { Input } from "@/components/ui/input"
import { PreviewMd } from "@/components/atoms/PreviewMd"
import { Skeleton } from "@/components/ui/skeleton"

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

const validators = {
  title: (value: string) => {
    if (value.length < 1 || value.length > 64) {
      return "問題タイトルは1文字以上64文字以下で入力してください"
    }
    return null
  },
}

export function ManageExerciseQuestionForm(props: Props) {
  if ("questionId" in props) {
    return (
      <div className='w-full h-full'>
        <ManageExerciseQuestionFormEdit questionId={props.questionId} />
      </div>
    )
  }

  if ("exerciseId" in props) {
    return (
      <div className='w-full h-full'>
        <ManageExerciseQuestionFormNew
          exerciseId={props.exerciseId}
          onSaved={props.onSaved}
        />
      </div>
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

  // ****************** 入力値のステート ******************

  const {
    value: title,
    errorMessage: titleError,
    onChange: onChangeTitle,
  } = useValidateInput({
    initialValue: "",
    validate: validators.title,
  })
  const {
    selectedValue: selectedQuestionType,
    onChange: onChangeQuestionType,
  } = useSelectInput<keyof typeof QuestionType>({
    selectOptions: objectKeys(QuestionType),
    initialValue: "TEXT",
  })
  const { selectedValue: selectedAnswerType, onChange: onChangeAnswerType } =
    useSelectInput<keyof typeof QuestionAnswerType>({
      selectOptions: objectKeys(QuestionAnswerType),
      initialValue: "SELECT",
    })

  // 問題文の入力値のステート

  const {
    value: questionContent,
    errorMessage: questionContentError,
    onChange: onChangeQuestionContent,
  } = useValidateInput({
    initialValue: "",
    validate: (value) => {
      if (
        value.length < STATICS.VALIDATE.QUESTION_CONTENT.MIN_LENGTH ||
        value.length > STATICS.VALIDATE.QUESTION_CONTENT.MAX_LENGTH
      ) {
        return `問題文は${STATICS.VALIDATE.QUESTION_CONTENT.MIN_LENGTH}文字以上、${STATICS.VALIDATE.QUESTION_CONTENT.MAX_LENGTH}文字以下で入力してください`
      }
      return null
    },
  })

  const {
    value: questionHint,
    errorMessage: questionHintError,
    onChange: onChangeQuestionHint,
  } = useValidateInput({
    initialValue: "",
    validate: (value) => {
      if (value.length > STATICS.VALIDATE.QUESTION_HINT.MAX_LENGTH) {
        return `ヒントは${STATICS.VALIDATE.QUESTION_HINT.MAX_LENGTH}文字以下で入力してください`
      }
      return null
    },
  })

  // 回答タイプごとのプロパティ入力のステート

  const {
    value: maxLength,
    errorMessage: maxLengthError,
    onChange: onChangeMaxLength,
  } = useValidateInput({
    initialValue: 1000,
    validate: (value) => {
      if (value < 1 || value > 1000) {
        return "回答の最大文字数は1文字以上1000文字以下で入力してください"
      }
      return null
    },
  })
  const {
    value: minLength,
    errorMessage: minLengthError,
    onChange: onChangeMinLength,
  } = useValidateInput({
    initialValue: 1,
    validate: (value) => {
      if (value < 1 || value > 1000) {
        return "回答の最小文字数は1文字以上1000文字以下で入力してください"
      }
      return null
    },
  })

  const {
    list: selection,
    onChangeObject: onChangeSelection,
    addObject: addSelection,
    removeObject: removeSelection,
    resetList: resetSelections,
  } = useObjectList({
    initialValue: [] as IgnoreKeysObject<
      QuestionAnswerPropertyEdit["SELECT"]["selection"],
      "answerId"
    >,
  })

  // ****************** 入力値のステート ******************

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
      questionProperty: {
        content: questionContent,
        hint: questionHint,
      },
      questionAnswerProperty:
        selectedAnswerType === "TEXT"
          ? {
              property: {
                maxLength,
                minLength,
              },
            }
          : {
              selection,
            },
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
    <>
      <div className='grid gap-y-2'>
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

        <div className='grid grid-cols-2 gap-x-4'>
          <div id='question-question-type'>
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

          <div id='question-answer-type'>
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

        {/* <div id='question-answer-version'></div> */}
      </div>

      <div className='mt-6 grid gap-y-2'>
        {/* 回答タイプ個別の詳細 */}

        <div>
          <label htmlFor='question-content'>問題文</label>
          <textarea
            id='question-content'
            value={questionContent}
            onChange={(e) => onChangeQuestionContent(e.target.value)}
            className='w-full p-2 border rounded'
            rows={4}
          />
          {questionContentError && (
            <p className='text-red-500 text-sm mt-1'>{questionContentError}</p>
          )}

          <PreviewMd md={questionContent} />
        </div>

        <div>
          <label htmlFor='question-hint'>ヒント</label>
          <textarea
            id='question-hint'
            value={questionHint}
            onChange={(e) => onChangeQuestionHint(e.target.value)}
            className='w-full p-2 border rounded'
            rows={2}
          />
          {questionHintError && (
            <p className='text-red-500 text-sm mt-1'>{questionHintError}</p>
          )}
        </div>

        {/* 回答タイプ個別の詳細 */}

        {(selectedAnswerType === "SELECT" ||
          selectedAnswerType === "MULTI_SELECT") && (
          <div>
            <label htmlFor='answer-selection'>選択肢</label>

            <div className='grid gap-y-2 px-2'>
              {selection.map((s, i) => {
                return (
                  <div
                    key={`selection-${i}`}
                    className='flex items-center gap-x-2'
                  >
                    <span
                      className='select-none cursor-pointer'
                      onClick={() => {
                        const isMultiSelect =
                          selectedAnswerType === "MULTI_SELECT"

                        if (isMultiSelect) {
                          onChangeSelection(i, {
                            ...s,
                            isCorrect: !s.isCorrect,
                          })
                          return
                        }

                        // 単一選択の場合は他の選択肢を全て不正解にする
                        const newSelection = selection.map((sel, idx) => ({
                          ...sel,
                          isCorrect: idx === i,
                        }))
                        resetSelections(newSelection)
                      }}
                    >
                      {s.isCorrect ? <CircleIcon /> : <XIcon />}
                    </span>

                    <Input
                      value={s.selectContent}
                      onChange={(e) =>
                        onChangeSelection(i, {
                          ...s,
                          selectContent: e.target.value,
                        })
                      }
                    />

                    <span
                      className='select-none cursor-pointer'
                      onClick={() => removeSelection(i)}
                    >
                      🗑️
                    </span>
                  </div>
                )
              })}
            </div>

            <div className='mt-2 px-4'>
              <ButtonBase
                sizeMode='full'
                colorMode='outline'
                onClick={() =>
                  addSelection({
                    selectContent: `選択肢${selection.length + 1}`,
                    isCorrect: false,
                  })
                }
              >
                追加
              </ButtonBase>
            </div>
          </div>
        )}

        {selectedAnswerType === "TEXT" && (
          <div>
            <div>
              <label htmlFor='answer-max-length'>最大文字数</label>
              <Input
                type='number'
                id='answer-max-length'
                value={maxLength}
                onChange={(e) => onChangeMaxLength(Number(e.target.value))}
              />
              {maxLengthError && (
                <p className='text-red-500 text-sm mt-1'>{maxLengthError}</p>
              )}
            </div>
            <div>
              <label htmlFor='answer-min-length'>最小文字数</label>
              <Input
                type='number'
                id='answer-min-length'
                value={minLength}
                onChange={(e) => onChangeMinLength(Number(e.target.value))}
              />
              {minLengthError && (
                <p className='text-red-500 text-sm mt-1'>{minLengthError}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className='mt-6 flex justify-end'>
        <ButtonBase colorMode='primary' sizeMode='full' onClick={_saveQuestion}>
          作成
        </ButtonBase>
      </div>
    </>
  )
}

function ManageExerciseQuestionFormEdit({
  questionId,
}: {
  questionId: string
}) {
  const {
    dataToGetManageQuestion,
    refetchManageQuestion,
    isLoadingToGetManageQuestion,
  } = useGetManageQuestion(questionId)

  const {
    value: title,
    errorMessage: titleError,
    onChange: onChangeTitle,
  } = useValidateInput({
    initialValue: dataToGetManageQuestion?.success
      ? dataToGetManageQuestion.data.question.title
      : "",
    validate: validators.title,
  })

  useEffect(() => {
    if (!dataToGetManageQuestion?.success) return

    onChangeTitle(dataToGetManageQuestion.data.question.title)
  }, [dataToGetManageQuestion, onChangeTitle])

  const _saveQuestion = () => {
    //
    refetchManageQuestion()
  }

  if (!dataToGetManageQuestion?.success) {
    return <p>未対応 {questionId}</p>
  }

  return (
    <>
      <div className='grid gap-y-2'>
        <div id='question-title'>
          <label htmlFor='title'>問題タイトル</label>
          {isLoadingToGetManageQuestion ? (
            <Skeleton className='h-[3rem] w-full border' />
          ) : (
            <input
              type='text'
              id='title'
              value={title}
              onChange={(e) => onChangeTitle(e.target.value)}
              className='w-full p-2 border rounded'
            />
          )}
        </div>
        {titleError && (
          <p className='text-red-500 text-sm mt-1'>{titleError}</p>
        )}
      </div>

      <div className='grid grid-cols-2 gap-x-4 py-2'>
        <div id='question-question-type'>
          <p>
            <span>問題タイプ:</span>
            {dataToGetManageQuestion.data.question.questionType}
          </p>
        </div>

        <div id='question-answer-type'>
          <p>
            <span>回答タイプ:</span>
            {dataToGetManageQuestion.data.question.answerType}
          </p>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-x-4 py-2'>
        <div id='question-question-type'>
          <p>
            <span>アクティブver:</span>
            {dataToGetManageQuestion.data.currentVersion ?? "-"}
          </p>
        </div>

        <div id='question-answer-type'>
          <p>
            <span>編集中ver:</span>
            <select></select>
          </p>
        </div>
      </div>

      <div className='mt-6 flex justify-end'>
        <ButtonBase colorMode='primary' sizeMode='full' onClick={_saveQuestion}>
          編集
        </ButtonBase>
      </div>
    </>
  )
}
