"use client"

import {
  useGetUserExerciseQuestions,
  usePatchUserExerciseQuestion,
} from "@/hooks/useApiV1"
import { ExerciseBase } from "@/lib/types/base/exerciseTypes"
import {
  QuestionAnswerContent,
  QuestionAnswerTypeType,
  QuestionForUser,
  QuestionUserAnswer,
} from "@/lib/types/base/questionTypes"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { ExerciseManageAnswerPart } from "../molecules/ExerciseManageAnswerPart"
import { ButtonBase } from "../atoms/ButtonBase"

type Props = {
  exerciseId: string
}

export function ExerciseManager({ exerciseId }: Props) {
  const {
    currentIndex,
    exercise,
    questions,
    currentQuestion,
    onAnswer,
    moveQuestion,
  } = useExerciseManager(exerciseId)

  return (
    <div className='max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow space-y-6 transition-all'>
      <h1 className='text-xl font-bold'>
        <span>{exercise.title}</span>

        <span>
          問題&nbsp;{currentIndex + 1} / {questions.length}
        </span>
      </h1>

      <div>
        <p className='text-lg font-medium'>{currentQuestion.content}</p>
      </div>

      <div className='space-y-3'>
        <ExerciseManageAnswerPart
          question={currentQuestion}
          onAnswer={(t, a) => {
            if (t === "SKIP") {
            } else {
              console.log(t, a)
              // handleAnswer(t, { ...a })
            }
          }}
        />
        {/* {currentQuestion.choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => handleAnswer("SELECT", index)}
            className='w-full border border-gray-300 px-4 py-3 rounded-xl text-left hover:bg-gray-50 transition'
          >
            {choice}
          </button>
        ))} */}
      </div>

      <div className='text-sm text-gray-500 flex justify-between'>
        {/* 選択肢を選ぶと次の問題に進みます */}
        <div></div>

        <div>
          {currentQuestion.isCanSkip ? (
            <ButtonBase colorMode='ghost' onClick={() => onAnswer("SKIP", {})}>
              スキップ
            </ButtonBase>
          ) : null}

          <ButtonBase colorMode='primary' onClick={() => moveQuestion("next")}>
            次へ
          </ButtonBase>
        </div>
      </div>
    </div>
  )
}

function useExerciseManager(exerciseId: string) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [state, setState] = useState<"answer" | "result">("answer")

  // const [answerLogSheetId, setAnswerLogSheetId] = useState<string | null>(null)

  const { dataToGetUserExerciseQuestions } = useGetUserExerciseQuestions(
    exerciseId,
    "answer",
  )
  const { requestPatchExerciseQuestion } = usePatchUserExerciseQuestion()

  const [exercise, setExercise] = useState<ExerciseBase>({
    title: "Exercise Title",
    description: "Exercise Description",
  })
  const [questions, setQuestions] = useState<QuestionForUser[]>([])

  const currentQuestion = useMemo(
    () => questions[currentIndex],
    [currentIndex, questions],
  )

  const answerLogSheetId = useMemo(() => {
    return dataToGetUserExerciseQuestions?.success
      ? dataToGetUserExerciseQuestions.data.answerLogSheetId ?? ""
      : ""
  }, [dataToGetUserExerciseQuestions])

  const onAnswer = async <T extends keyof QuestionUserAnswer>(
    answerType: T,
    answer: QuestionUserAnswer[T],
  ) => {
    console.log(answerType, answer)
    const result = await requestPatchExerciseQuestion({
      exerciseId,
      answerLogSheetId,
      questionUserLogId: currentQuestion.questionUserLogId,
      answer: {
        type: answerType,
        ...answer,
      },
    })
    if (!result.success) {
      alert("回答に失敗しました")
      return
    }

    // 都度採点
    if (result.data.result) {
    }

    // const newAnswers = [...answers]
    // newAnswers[currentIndex] = choiceIndex
    // setAnswers(newAnswers)
    // 次へ or 終了
    // if (currentIndex < dummyQuestions.length - 1) {
    //   setCurrentIndex((prev) => prev + 1)
    // } else {
    //   alert("回答が完了しました！")
    //   router.push("/v1/user") // または /result へ
    // }
  }

  const moveQuestion = (to: "next" | "prev") => {
    if (to === "next" && currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else if (to === "prev" && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    } else {
      // リザルト画面へ
    }
  }

  useEffect(() => {
    if (
      !(
        dataToGetUserExerciseQuestions && dataToGetUserExerciseQuestions.success
      )
    ) {
      router.push("/v1/user/exercise")
      return
    }

    setExercise({
      title: dataToGetUserExerciseQuestions.data.exercise.title,
      description: dataToGetUserExerciseQuestions.data.exercise.description,
    })
    setQuestions(dataToGetUserExerciseQuestions.data.questions)
  }, [dataToGetUserExerciseQuestions, router])

  return {
    exercise,
    currentIndex,
    questions,
    currentQuestion,
    onAnswer,
    moveQuestion,
  }
}
