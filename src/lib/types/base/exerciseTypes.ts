export type Exercise = ExerciseBaseIdentifier &
  ExerciseBase &
  ExerciseBaseProperty &
  ExerciseBaseDate

export type ExerciseBaseIdentifier = {
  exerciseId: string
}

export type ExerciseBase = {
  title: string
  description: string
}

export type ExerciseBaseProperty = {
  schoolId: string
  /**
   * @description 問題集の公開状態
   */
  isPublished: boolean
  /**
   * @description 問題をスキップできるか
   */
  isCanSkip: boolean
  /**
   * @description 一括採点を行うか
   */
  isScoringBatch: boolean
}

export type ExerciseBaseDate = {
  createdAt: Date
  updatedAt: Date
}
