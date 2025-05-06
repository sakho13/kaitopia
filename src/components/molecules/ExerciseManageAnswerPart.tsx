"use client"

import { joincn } from "@/lib/functions/joincn"
import {
  QuestionAnswerContent,
  QuestionForUser,
  QuestionUserAnswer,
} from "@/lib/types/base/questionTypes"

type AnswerState = {
  selectedAnswerIds: string[]
  textAnswer: string
}

type Props = {
  question: QuestionForUser
  onAnswer: <T extends QuestionAnswerContent["type"]>(
    type: T,
    userAnswer: QuestionUserAnswer[T],
  ) => void
  answerState: AnswerState
}

export function ExerciseManageAnswerPart({
  question,
  onAnswer,
  answerState,
}: Props) {
  if (
    (question.answerType === "SELECT" ||
      question.answerType === "MULTI_SELECT") &&
    "selection" in question.answer
  )
    return (
      <div className='space-y-3'>
        <p className='select-none text-sm text-gray-500'>
          {question.answerType === "SELECT" ? "単一選択" : "複数選択"}
        </p>

        {question.answer.selection.map(({ answerId, selectContent }, index) => {
          const selected = answerState.selectedAnswerIds.includes(answerId)

          return (
            <button
              key={index}
              onClick={() => {
                if (question.answerType === "SELECT") {
                  onAnswer("SELECT", { answerId })
                }

                if (question.answerType === "MULTI_SELECT") {
                  onAnswer("MULTI_SELECT", {
                    answerIds: [answerId],
                  })
                }
              }}
              className={joincn(
                "w-full px-4 py-3 rounded-xl text-left",
                "cursor-pointer transition",
                "border border-gray-300",
                selected
                  ? "bg-secondary text-text font-bold"
                  : "hover:bg-gray-50",
              )}
            >
              {selectContent}
            </button>
          )
        })}
      </div>
    )

  if (question.answerType === "TEXT" && "property" in question.answer)
    return (
      <div>
        <textarea
          value={answerState.textAnswer}
          onChange={(e) => {
            onAnswer("TEXT", { content: e.target.value })
          }}
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
