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
  questionType: QuestionTypeType
  answerType: QuestionAnswerTypeType
}

export type QuestionBaseStatus = {
  isPublished: boolean
}

export type QuestionBasePublishedState = {
  currentVersion: number
}

export type QuestionBaseEditState = {
  draftVersion: number
}

export type QuestionBaseDate = {
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
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

export type QuestionAnswerContent = QuestionAnswerBaseIdentifier &
  (
    | {
        type: "SKIP"
      }
    | {
        type: "SELECT"
        answerId: string
      }
    | {
        type: "MULTI_SELECT"
        answerIds: string[]
      }
    | {
        type: "TEXT"
        content: string
      }
  )

export const QuestionType = {
  TEXT: "TEXT",
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
  AUDIO: "AUDIO",
} as const

export type QuestionTypeType = keyof typeof QuestionType

export const QuestionAnswerType = {
  SELECT: "SELECT",
  MULTI_SELECT: "MULTI_SELECT",
  TEXT: "TEXT",
} as const

export type QuestionAnswerTypeType = keyof typeof QuestionAnswerType
