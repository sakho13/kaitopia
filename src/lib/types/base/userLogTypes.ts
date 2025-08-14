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