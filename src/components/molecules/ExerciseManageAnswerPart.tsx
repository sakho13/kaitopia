"use client"

import {
  QuestionAnswerContent,
  QuestionForUser,
  QuestionUserAnswer,
} from "@/lib/types/base/questionTypes"
import { useEffect, useState } from "react"

type Props = {
  question: QuestionForUser
  onAnswer: <T extends QuestionAnswerContent["type"]>(
    type: T,
    userAnswer: QuestionUserAnswer[T],
  ) => void
}

export function ExerciseManageAnswerPart({ question, onAnswer }: Props) {
  const [answerMultiSelect, setAnswerMultiSelect] = useState<string[]>([])
  const [answerText, setAnswerText] = useState<string>("")

  const _clearAll = () => {
    setAnswerMultiSelect([])
    setAnswerText("")
  }

  const _resetState = () => {
    _clearAll()

    //
  }

  useEffect(() => {
    //
  }, [question.questionUserLogId])

  //

  if (
    (question.answerType === "SELECT" ||
      question.answerType === "MULTI_SELECT") &&
    "selection" in question.answer
  )
    return (
      <div className='space-y-3'>
        {question.answer.selection.map(({ answerId, selectContent }, index) => (
          <button
            key={index}
            onClick={() =>
              onAnswer(
                question.answerType,
                question.answerType === "SELECT"
                  ? { answerId }
                  : { answerIds: [] },
              )
            }
            className='w-full border border-gray-300 px-4 py-3 rounded-xl text-left hover:bg-gray-50 transition'
          >
            {selectContent}
          </button>
        ))}
      </div>
    )

  if (question.answerType === "TEXT" && "property" in question.answer)
    return (
      <div>
        <textarea
          minLength={question.answer.property.minLength}
          maxLength={question.answer.property.maxLength}
        />
      </div>
    )

  return (
    <div>
      <p>データがありません</p>
    </div>
  )
}
