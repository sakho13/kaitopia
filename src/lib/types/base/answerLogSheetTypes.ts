// *********************
//    AnswerLogSheet
// *********************

export type AnswerLogSheet = AnswerLogSheetBaseIdentifier & AnswerLogSheetBase

export type AnswerLogSheetBaseIdentifier = {
  userId: string
  answerLogSheetId: string
}

export type AnswerLogSheetBase = {
  isInProgress: boolean

  /**
   * 合計正解数
   *
   * QuestionTypeがSELECT/MULTI_SELECTのみ集計
   */
  totalCorrectCount: number
  /**
   * 合計不正解数
   *
   * QuestionTypeがSELECT/MULTI_SELECTのみ集計
   */
  totalIncorrectCount: number
  /**
   * 合計未回答数
   *
   * QuestionTypeがSELECT/MULTI_SELECTのみ集計
   */
  totalUnansweredCount: number
}

export type AnswerLogSheetBaseDate = {
  createdAt: Date
  updatedAt: Date
}

/**
 * @description 回答ログシートの関連情報
 */
export type AnswerLogSheetRelated =
  | AnswerLogSheetRelatedExerciseIdentifier
  | AnswerLogSheetRelatedTestIdentifier

export type AnswerLogSheetRelatedExerciseIdentifier = {
  exerciseId: string
}

/**
 * @description 未実装
 */
export type AnswerLogSheetRelatedTestIdentifier = {
  testId: string
}
