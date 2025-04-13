"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"

type Question = {
  id: number
  content: string
  choices: string[]
  correctAnswerIndex: number // 本番では非表示
}

const dummyQuestions: Question[] = [
  {
    id: 1,
    content: "JavaScriptのデータ型に存在しないものはどれ？",
    choices: ["string", "number", "float", "boolean"],
    correctAnswerIndex: 2,
  },
  {
    id: 2,
    content: "HTMLの略は？",
    choices: [
      "Hyper Tool Markup Language",
      "HyperText Markup Language",
      "Home Type Mark Language",
    ],
    correctAnswerIndex: 1,
  },
]

export default function ExerciseAnswerPage() {
  const router = useRouter()
  const param = useParams<{ eid?: string }>()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  const currentQuestion = dummyQuestions[currentIndex]

  const handleAnswer = (choiceIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentIndex] = choiceIndex
    setAnswers(newAnswers)

    // 次へ or 終了
    if (currentIndex < dummyQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      alert("回答が完了しました！")
      router.push("/v1/user") // または /result へ
    }
  }

  return (
    <div className='min-h-screen bg-kaitopia-background text-kaitopia-text p-8 font-sans'>
      <div className='max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow space-y-6'>
        <h1 className='text-xl font-bold'>
          問題 {currentIndex + 1} / {dummyQuestions.length}
        </h1>

        <div>
          <p className='text-lg font-medium'>{currentQuestion.content}</p>
        </div>

        <div className='space-y-3'>
          {currentQuestion.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className='w-full border border-gray-300 px-4 py-3 rounded-xl text-left hover:bg-gray-50 transition'
            >
              {choice}
            </button>
          ))}
        </div>

        <div className='text-sm text-gray-500'>
          選択肢を選ぶと次の問題に進みます
        </div>
      </div>
    </div>
  )
}
