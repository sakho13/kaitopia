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
  isCanSkip: boolean
  isScoringBatch: boolean
}

export type ExerciseBaseDate = {
  createdAt: Date
  updatedAt: Date
}
