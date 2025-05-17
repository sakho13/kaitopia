"use client"

import { Circle, XIcon } from "lucide-react"
import { ApiV1OutTypeMap } from "@/lib/types/apiV1Types"
import { ThinMultiProgressBar } from "../atoms/ThinMultiProgressBar"
import { joincn } from "@/lib/functions/joincn"

type Props = {
  data: ApiV1OutTypeMap["GetUserResultLogSheet"]
}

export function AnswerLogSheetExercise({ data }: Props) {
  if (!data.exercise)
    return (
      <div>
        <p className='font-bold text-red-500'>404 Not Found.</p>
      </div>
    )

  return (
    <div id={`answer-log-sheet-exercise-${data.answerLogSheetId}`}>
      <div
        id='answer-log-sheet-head'
        className='mb-4 text-center font-bold text-2xl select-none'
      >
        {data.exercise ? (
          <p>{data.exercise.title}</p>
        ) : (
          <p>問題集の情報がありません。</p>
        )}
      </div>

      <div id='answer-log-sheet-summary' className='mb-4'>
        <div className='flex justify-end'>
          <div className='text-sm text-gray-500 select-none flex gap-3 mb-2 mr-4'>
            <div className='w-fit'>
              <p>&nbsp;</p>
              <p>
                問題数:
                <span className='font-semibold'>
                  {" "}
                  {data.detail.questionUserLogs.length}
                </span>
              </p>
            </div>
            <div className='w-fit'>
              <p>
                正解数:
                <span className='font-semibold'>
                  {" "}
                  {data.detail.totalCorrectCount}
                </span>
              </p>
              <p>
                不正解数:
                <span className='font-semibold'>
                  {" "}
                  {data.detail.totalIncorrectCount}
                </span>
              </p>
            </div>
          </div>
        </div>

        <ThinMultiProgressBar
          totalProgress={data.detail.questionUserLogs.length}
          progresses={[
            { progress: data.detail.totalUnansweredCount, color: "#d3d3d3" },
            { progress: data.detail.totalCorrectCount, color: "#98d0ff" },
            { progress: data.detail.totalIncorrectCount, color: "#ff6b6b" },
          ]}
        />
      </div>

      <div id='answer-log-sheet-questions'>
        {data.detail.questionUserLogs.map((q, i) => {
          return (
            <div key={q.questionUserLogId} className='mb-4'>
              <div>
                <p className='text-text'>
                  <span className='font-bold'>Q.{i + 1}</span>
                </p>
              </div>

              <div className='mx-2'>
                <p className='text-gray-600'>{q.content}</p>
              </div>

              <div className='mx-4'>
                {q.answerType === "TEXT" && (
                  <div>{/* <p>回答：{ q.answers}</p> */}</div>
                )}

                {(q.answerType === "MULTI_SELECT" ||
                  q.answerType === "SELECT") &&
                "selection" in q.answers ? (
                  <div className='flex flex-col gap-2'>
                    {q.answers.selection.map((s) => {
                      // ユーザが正解した選択肢のみを選択した
                      const isCorrectCounted = q.userAnswers.every(
                        ({ isCorrect, isSelected }) => {
                          if (isCorrect) return isSelected
                          return !isSelected
                        },
                      )
                      const t = q.userAnswers.find(
                        (a) => a.answerId === s.answerId,
                      )
                      const isSelected = t ? t.isSelected : false
                      const isCorrect = t ? t.isCorrect : false

                      return (
                        <div
                          key={`${q.questionId}-${s.answerId}`}
                          id={`answer-log-sheet-question-${q.questionId}-${s.answerId}`}
                          className={joincn(
                            "border border-gray-300 rounded-xl",
                            "px-3 py-2",
                            "text-sm",
                            "transition",
                            "flex justify-between items-center",
                            isCorrectCounted && isCorrect
                              ? "bg-blue-100 border-blue-300"
                              : isSelected
                              ? "bg-gray-100 border-gray-300"
                              : "",
                          )}
                        >
                          <div>
                            <span className={isSelected ? "font-bold" : ""}>
                              {s.selectContent}
                            </span>
                          </div>

                          <div>
                            {isCorrect ? (
                              <Circle className='text-gray-700' />
                            ) : (
                              <XIcon className='text-gray-700' />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
