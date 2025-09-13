import { QuestionForResult } from "./questionTypes"

export type AnswerLogSheetSummary = {
  answerLogSheetId: string
  isInProgress: boolean
  totalCorrectCount: number
  totalIncorrectCount: number
  totalUnansweredCount: number
  totalQuestionCount: number
  exerciseId: string | null
  exercise: {
    id: string
    title: string
  } | null
  createdAt: Date
  updatedAt: Date
}

export type AnswerLogSheetDetail = {
  isInProgress: boolean
  totalQuestionCount: number
  totalCorrectCount: number
  totalIncorrectCount: number
  totalUnansweredCount: number
  questionAnswerProperties: QuestionForResult[]
  exercise: {
    id: string
    title: string
    description: string
  } | null
  createdAt: Date
  updatedAt: Date
}