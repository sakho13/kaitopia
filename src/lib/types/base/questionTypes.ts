// *********************
//       Question
// *********************

export type Question = QuestionBaseIdentifier & QuestionBase

export type QuestionBaseIdentifier = {
  questionId: string
  schoolId: string
}

export type QuestionBase = {
  title: string
  currentVersion: number
  questionType: QuestionTypeType
  answerType: QuestionAnswerTypeType
}

export type QuestionBaseStatus = {
  isPublished: boolean
}

export type QuestionBaseEditState = {
  draftVersion: number
}

export type QuestionBaseAnswers = {
  answers: QuestionAnswer[]
}

export type QuestionVersion = QuestionVersionBaseIdentifier &
  QuestionVersionBase

export type QuestionVersionBaseIdentifier = {
  questionId: string
  version: number
}

export type QuestionVersionBase = {
  content: string
  hint: string
}

// *********************
//    QuestionAnswer
// *********************

export type QuestionAnswer = QuestionAnswerBaseIdentifier

export type QuestionAnswerBaseIdentifier = {
  questionId: string
  version: number
  answerId: string
}

export type QuestionAnswerProperty = {
  SELECT: {
    selection: {
      answerId: string
      selectContent: string
    }[]
  }
  MULTI_SELECT: {
    selection: {
      answerId: string
      selectContent: string
    }[]
  }
  TEXT: {
    property: {
      answerId: string
      minLength: number
      maxLength: number
    }
  }
}

/**
 * 問題の回答を表す型
 */
export type QuestionAnswerBase<T extends QuestionAnswerTypeType> = {
  type: T
  properties: QuestionAnswerProperty[T]
}

export type QuestionAnswerContent = {
  SELECT: {
    answerId: string
  }
  MULTI_SELECT: {
    answerId: string[]
  }
  TEXT: {
    content: string
  }
}

/**
 * ユーザが選択/入力した回答を表す型
 */
export type UserAnswer<T extends QuestionAnswerTypeType> = {
  type: T
  answer: QuestionAnswerContent[T]
}

export const QuestionType = {
  TEXT: "TEXT",
  IMAGE: "IMAGE",
} as const

export type QuestionTypeType = keyof typeof QuestionType

export const QuestionAnswerType = {
  SELECT: "SELECT",
  MULTI_SELECT: "MULTI_SELECT",
  TEXT: "TEXT",
} as const

export type QuestionAnswerTypeType = keyof typeof QuestionAnswerType
