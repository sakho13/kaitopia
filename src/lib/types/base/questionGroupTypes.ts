export type QuestionGroup = QuestionGroupBaseIdentifier &
  QuestionGroupBase &
  QuestionGroupBaseDate

export type QuestionGroupBaseIdentifier = {
  questionGroupId: string
}

export type QuestionGroupBase = {
  schoolId: string
  name: string
}

export type QuestionGroupBaseDate = {
  createdAt: Date
  updatedAt: Date
}
