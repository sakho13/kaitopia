"use client"

import { useMemo, useState } from "react"
import { redirect } from "next/navigation"
import {
  useGetUserExerciseQuestions,
  usePostUserExerciseQuestion,
} from "@/hooks/useApiV1"
import { QuestionForUser } from "@/lib/types/base/questionTypes"
import { useBoolean } from "@/hooks/common/useBoolean"
import { useQuestionAnswer } from "@/hooks/useQuestionAnswer"
import { ApiV1OutTypeMap } from "@/lib/types/apiV1Types"
import { joincn } from "@/lib/functions/joincn"
import { ButtonBase } from "../atoms/ButtonBase"
import { ExerciseManageAnswerPart } from "../molecules/ExerciseManageAnswerPart"
import { Skeleton } from "../ui/skeleton"
import { ThinProgressBar } from "../atoms/ThinProgressBar"

type Props = {
  exerciseId: string
}

export function ExerciseManager({ exerciseId }: Props) {
  const {
    state,
    patchResult,
    postResult,
    isLoadingToGetUserExerciseQuestions,
    currentIndex,
    exercise,
    questions,
    currentQuestion,
    answerState,
    showHint,

    onAnswer,
    onClickNext,
    onClickHint,
  } = useExerciseManager(exerciseId)

  if (
    isLoadingToGetUserExerciseQuestions ||
    exercise === null ||
    currentQuestion === null
  ) {
    return <Skeleton className='w-full h-[400px]' />
  }

  if (state === "result") {
    const correctPercent = Math.round(
      ((postResult?.result.totalCorrectCount ?? 0) /
        (postResult?.result.totalQuestionCount ?? 1)) *
        100,
    )
    const incorrectPercent = Math.round(
      ((postResult?.result.totalIncorrectCount ?? 0) /
        (postResult?.result.totalQuestionCount ?? 1)) *
        100,
    )
    const unansweredPercent = Math.round(
      ((postResult?.result.totalUnansweredCount ?? 0) /
        (postResult?.result.totalQuestionCount ?? 1)) *
        100,
    )

    return (
      <div className='max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow space-y-6 transition-all'>
        <h1 className='text-lg font-bold text-text'>
          回答結果&nbsp;「{exercise.title}」
        </h1>

        <div className='select-none grid grid-cols-2 gap-4'>
          <div className='border rounded-lg px-4 py-2'>
            <p className='text-text'>
              <span className='font-semibold'>全問題数:</span>&nbsp;
              <span className='text-2xl'>
                {postResult?.result.totalQuestionCount ?? 0}
              </span>
            </p>
          </div>

          <div className='border rounded-lg px-4 py-2 relative'>
            <div
              className={joincn(
                `h-full bg-green-100 opacity-30`,
                "absolute top-0 left-0",
                "rounded-lg",
                "transition delay-75",
              )}
              style={{
                width: `${correctPercent}%`,
              }}
            />

            <p className='text-green-600'>
              <span className='font-semibold'>正解数:</span>&nbsp;
              <span className='text-2xl'>
                {postResult?.result.totalCorrectCount ?? 0}
              </span>
            </p>
          </div>

          <div className='border rounded-lg px-4 py-2 relative'>
            <div
              className={joincn(
                `h-full bg-red-100 opacity-30`,
                "absolute top-0 left-0",
                "rounded-lg",
                "transition delay-100",
              )}
              style={{
                width: `${incorrectPercent}%`,
              }}
            />

            <p className='text-red-600'>
              <span className='font-semibold'>不正解数:</span>
              &nbsp;
              <span className='text-2xl'>
                {postResult?.result.totalIncorrectCount ?? 0}
              </span>
            </p>
          </div>

          <div className='border rounded-lg px-4 py-2 relative'>
            <div
              className={joincn(
                `h-full bg-gray-100 opacity-30`,
                "absolute top-0 left-0",
                "rounded-lg",
                "transition delay-150",
              )}
              style={{
                width: `${unansweredPercent}%`,
              }}
            />

            <p className='text-gray-600'>
              <span className='font-semibold'>未回答数:</span>&nbsp;
              <span className='text-2xl'>
                {postResult?.result.totalUnansweredCount ?? 0}
              </span>
            </p>
          </div>
        </div>

        <div>
          <ButtonBase
            onClick={() => redirect("/v1/user")}
            sizeMode='full'
            colorMode='primary'
            className='font-semibold py-4'
          >
            トップに戻る
          </ButtonBase>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow space-y-6 transition-all'>
      <ThinProgressBar
        progress={((currentIndex + 1) / questions.length) * 100}
        colorBorders={[
          { progress: 10, color: "#d3d3d3" },
          { progress: 50, color: "#98d0ff" },
          { progress: 80, color: "#95daaf" },
        ]}
      />

      <h1 className='text-xl font-bold select-none'>
        <span>{exercise.title}</span>

        <span className='text-md text-gray-500 ml-2'>
          {currentIndex + 1} 問目 / {questions.length}
        </span>
      </h1>

      <div id='question-content'>
        <p className='text-lg font-medium select-none'>
          {currentQuestion.content}
        </p>
      </div>

      <div className='space-y-3'>
        <ExerciseManageAnswerPart
          question={currentQuestion}
          onAnswer={(t, a) => {
            if (patchResult) return
            onAnswer(t, a)
          }}
          answerState={answerState}
        />
      </div>

      <div id='question-options' className=''>
        {showHint && (
          <p className='select-none text-gray-600 mx-4'>
            <span className='font-semibold'>ヒント:&nbsp;</span>
            <span>{currentQuestion.hint}</span>
          </p>
        )}
      </div>

      <div
        className={joincn(
          "text-sm text-gray-500 flex justify-between px-4 py-2",
          patchResult === undefined ? "" : "",
        )}
      >
        {patchResult === undefined ? (
          <>
            <div>
              {currentQuestion.isCanSkip ? (
                <ButtonBase
                  colorMode='ghost'
                  className='px-4'
                  onClick={() => onAnswer("SKIP", { skipped: true })}
                >
                  スキップ
                </ButtonBase>
              ) : null}

              {currentQuestion.hint && !showHint ? (
                <ButtonBase
                  onClick={onClickHint}
                  title='まだガンバってみません？'
                >
                  ヒント
                </ButtonBase>
              ) : null}
            </div>

            <ButtonBase
              colorMode='primary'
              className='px-4 text-lg'
              onClick={onClickNext}
            >
              次へ
            </ButtonBase>
          </>
        ) : (
          <>
            <div
              className={joincn(
                "text-lg select-none",
                "flex items-center",
                "transition",
              )}
            >
              {patchResult?.skipped === true ? (
                <p
                  className={joincn(
                    "text-gray-600 font-bold bg-gray-100",
                    "border-2 border-gray-300",
                    "px-4 py-2 rounded-md",
                  )}
                >
                  スキップしました
                </p>
              ) : null}

              {patchResult?.isCorrect === true ? (
                <p
                  className={joincn(
                    "text-green-600 font-bold bg-green-100",
                    "border-2 border-green-300",
                    "px-4 py-2 rounded-md",
                  )}
                >
                  正解！
                </p>
              ) : patchResult?.isCorrect === false ? (
                <p
                  className={joincn(
                    "text-red-600 font-bold bg-red-100",
                    "border-2 border-red-300",
                    "px-4 py-2 rounded-md",
                  )}
                >
                  不正解
                </p>
              ) : (
                <p
                  className={joincn(
                    "text-green-600 font-bold bg-green-100",
                    "border-2 border-green-300",
                    "px-4 py-2 rounded-md",
                  )}
                >
                  <span>スコア&nbsp;{patchResult.questionScore}</span>
                </p>
              )}
            </div>

            <ButtonBase
              colorMode='primary'
              className='px-4 text-lg'
              onClick={onClickNext}
            >
              次へ
            </ButtonBase>
          </>
        )}

        {/*  */}
      </div>
    </div>
  )
}

function useExerciseManager(exerciseId: string) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [state, setState] = useState<"answer" | "result">("answer")
  const [answerLoading, setAnswerLoading] = useState(false)
  const { value: showHint, onChange: setShowHint } = useBoolean(false)

  const [patchResult, setPatchResult] =
    useState<ApiV1OutTypeMap["PatchUserExerciseQuestion"]>()
  const [postResult, setPostResult] =
    useState<ApiV1OutTypeMap["PostUserExerciseQuestion"]>()

  const {
    dataToGetUserExerciseQuestions,
    isLoadingToGetUserExerciseQuestions,
  } = useGetUserExerciseQuestions(exerciseId, "answer")
  const { requestPostExerciseQuestion } = usePostUserExerciseQuestion()

  // *********** memo ***********

  const exercise = useMemo(
    () =>
      dataToGetUserExerciseQuestions?.success
        ? dataToGetUserExerciseQuestions.data.exercise
        : null,
    [dataToGetUserExerciseQuestions],
  )
  const questions = useMemo(
    () =>
      dataToGetUserExerciseQuestions?.success
        ? dataToGetUserExerciseQuestions.data.questions
        : [],
    [dataToGetUserExerciseQuestions],
  )
  const currentQuestion = useMemo(
    () =>
      dataToGetUserExerciseQuestions?.success
        ? dataToGetUserExerciseQuestions.data.questions[currentIndex]
        : (null as unknown as QuestionForUser),
    [currentIndex, dataToGetUserExerciseQuestions],
  )
  const answerLogSheetId = useMemo(() => {
    return dataToGetUserExerciseQuestions?.success
      ? dataToGetUserExerciseQuestions.data.answerLogSheetId ?? ""
      : ""
  }, [dataToGetUserExerciseQuestions])

  // *********** memo ***********

  const {
    selectedAnswerIds,
    textAnswer,
    answerError,
    onAnswer,
    onSubmitAnswer,
    resetAnswer,
  } = useQuestionAnswer({
    answerLogSheetId,
    question: currentQuestion,
    exerciseId,
  })

  const onClickNext = () => {
    if (patchResult) {
      setShowHint(false)
      resetAnswer()
      _moveNextQuestion()
      return
    }

    if (answerError !== null) {
      return
    }

    if (answerLoading) return
    setAnswerLoading(true)

    if (!exercise?.isScoringBatch) {
      onSubmitAnswer()
        .then(async (result) => {
          if (result?.fn === "total-result") {
            // リザルト画面へ
            await _sendAnswer()
            setState("result")
            return
          }

          setPatchResult(result)
        })
        .finally(() => {
          setAnswerLoading(false)
        })
    }
  }

  const onClickHint = () => {
    setShowHint(true)
  }

  const _sendAnswer = async () => {
    const result = await requestPostExerciseQuestion(exerciseId, {
      answerLogSheetId,
      exerciseId,
    })
    if (!result.success) return
    if (result.data.fn === "answer") {
      console.log("必要な回答情報が不足しています")
      return
    }
    setPostResult(result.data)
  }

  const _moveNextQuestion = () => {
    setPatchResult(undefined)
    _moveQuestion("next")
  }

  const _moveQuestion = (to: "next" | "prev") => {
    if (to === "next" && currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else if (to === "prev" && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  return {
    state,
    answerLoading,
    patchResult,
    postResult,
    isLoadingToGetUserExerciseQuestions,
    exercise,
    currentIndex,
    questions,
    currentQuestion,
    answerState: {
      selectedAnswerIds,
      textAnswer,
    },
    showHint,

    onAnswer,
    onClickNext,
    onClickHint,
  }
}
