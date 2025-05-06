import {
  QuestionForUser,
  QuestionUserAnswer,
} from "@/lib/types/base/questionTypes"
import { useState } from "react"
import { usePatchUserExerciseQuestion } from "./useApiV1"

type AnswerProps = {
  answerLogSheetId: string
  question: QuestionForUser
  exerciseId?: string
}

export function useQuestionAnswer({
  answerLogSheetId,
  question,
  exerciseId,
}: AnswerProps) {
  const [selectedAnswerIds, setSelectedAnswerIds] = useState<string[]>([])
  const [textAnswer, setTextAnswer] = useState<string>("")
  const [answerError, setAnswerError] = useState<string | null>(null)

  const { requestPatchExerciseQuestion } = usePatchUserExerciseQuestion()

  const onAnswer = async <T extends keyof QuestionUserAnswer>(
    answerType: T,
    answer: QuestionUserAnswer[T],
  ) => {
    if (answerError !== null) {
      setAnswerError(null)
      return
    }

    if (answerType === "SELECT" && "answerId" in answer) {
      setSelectedAnswerIds(() => [answer.answerId])
    }

    if (answerType === "MULTI_SELECT" && "answerIds" in answer) {
      setSelectedAnswerIds((p) => {
        if (p.includes(answer.answerIds[0])) {
          return p.filter((id) => id !== answer.answerIds[0])
        }
        return [...p, ...answer.answerIds]
      })
    }

    if (answerType === "TEXT" && "content" in answer) {
      setTextAnswer(answer.content)
    }
  }

  const onSubmitAnswer = async () => {
    if (!question) return
    if (!answerLogSheetId) return

    // 回答送信
    const result = await _sendAnswerByExercise()
    if (!result) return
    if (!result.success) return

    return result.data
  }

  const resetAnswer = () => {
    _initAnswerState()
  }

  const _sendAnswerByExercise = async () => {
    if (!exerciseId) return null

    if (question.answerType === "SELECT") {
      if (selectedAnswerIds.length === 0) {
        setAnswerError("回答を選択してください")
        return null
      }

      return await requestPatchExerciseQuestion({
        answerLogSheetId,
        exerciseId,
        questionUserLogId: question.questionUserLogId,
        answer: {
          type: "SELECT",
          answerId: selectedAnswerIds[0],
        },
      })
    }

    if (question.answerType === "MULTI_SELECT") {
      if (selectedAnswerIds.length === 0) {
        setAnswerError("回答を選択してください")
        return null
      }

      return await requestPatchExerciseQuestion({
        answerLogSheetId,
        exerciseId,
        questionUserLogId: question.questionUserLogId,
        answer: {
          type: "MULTI_SELECT",
          answerIds: selectedAnswerIds,
        },
      })
    }

    if (question.answerType === "TEXT") {
      return await requestPatchExerciseQuestion({
        answerLogSheetId,
        exerciseId,
        questionUserLogId: question.questionUserLogId,
        answer: {
          type: "TEXT",
          content: textAnswer,
        },
      })
    }

    return null
  }

  const _initAnswerState = () => {
    if (!("type" in question)) {
      _resetState()
      return
    }

    if (question.type === "SELECT") {
      if ("answerId" in question) {
        setSelectedAnswerIds([question.answerId])
      } else {
        setSelectedAnswerIds([])
      }
    }

    if (question.type === "MULTI_SELECT") {
      if ("answerIds" in question) {
        setSelectedAnswerIds(question.answerIds)
      } else {
        setSelectedAnswerIds([])
      }
    }

    if (question.type === "TEXT") {
      if ("content" in question) {
        setTextAnswer(question.content)
      } else {
        setTextAnswer("")
      }
    }
  }

  const _resetState = () => {
    setSelectedAnswerIds([])
    setTextAnswer("")
  }

  return {
    selectedAnswerIds,
    textAnswer,
    answerError,

    onAnswer,
    onSubmitAnswer,
    resetAnswer,
  }
}
