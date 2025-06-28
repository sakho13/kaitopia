// *********************
//      ユーザ用
// *********************

import { IgnoreKeysObject } from "../common/IgnoreKeysObject"
import {
  QuestionGroupBase,
  QuestionGroupBaseIdentifier,
} from "./questionGroupTypes"

/**
 * ユーザが回答するときの問題の型
 */
export type QuestionForUser = {
  /**
   * 出題ログID 単純に閲覧する場合 questionId
   */
  questionUserLogId: string
  questionId: string

  title: string
  questionType: QuestionTypeType

  content: string
  hint: string

  isCanSkip: boolean | null

  answerType: QuestionAnswerTypeType
  questionGroups: (QuestionGroupBaseIdentifier & QuestionGroupBase)[]
  answer: QuestionAnswerForUser<QuestionAnswerTypeType>
} & (QuestionAnswerContent | object) // すでに回答していた場合に現れるオブジェクト

/**
 * ユーザが回答するときの回答の型(送信するときの型ではない)
 */
export type QuestionAnswerForUser<T extends QuestionAnswerTypeType> =
  QuestionAnswerProperty[T]

export type QuestionForResult = {
  questionUserLogId: string
  questionId: string

  title: string
  questionType: QuestionTypeType

  content: string
  hint: string

  score: number

  answerType: QuestionAnswerTypeType

  userAnswers: {
    answerId: string
    isCorrect: boolean
    isSelected: boolean
  }[]
  answers: QuestionAnswerForUser<QuestionAnswerTypeType>
}

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

export type QuestionAnswerPropertyEdit = {
  SELECT: {
    selection: {
      answerId: string
      selectContent: string
      isCorrect: boolean
    }[]
  }
  MULTI_SELECT: {
    selection: {
      answerId: string
      selectContent: string
      isCorrect: boolean
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

export type QuestionUserAnswer = {
  SKIP: {
    skipped: true
  }
  SELECT: {
    answerId: string
  }
  MULTI_SELECT: {
    answerIds: string[]
  }
  TEXT: {
    content: string
  }
}

export type QuestionUserAnswerType<K extends keyof QuestionUserAnswer> = {
  type: K
} & QuestionUserAnswer[K]

export type QuestionAnswerContent = QuestionUserAnswerType<
  keyof QuestionUserAnswer
>

export const QUESTION_TYPES = ["TEXT", "IMAGE", "VIDEO", "AUDIO"] as const
export const QUESTION_ANSWER_TYPES = ["SELECT", "MULTI_SELECT", "TEXT"] as const

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

/**
 * 登録用の問題の基本型
 */
export type RegisterQuestionType<
  A extends QuestionAnswerTypeType,
  Q extends QuestionTypeType,
> = {
  /** 1~64文字 */
  title: string
  questionType: Q
  answerType: A

  questionProperty: {
    content: string
    hint: string
  }
  questionAnswerProperty: IgnoreKeysObject<
    QuestionAnswerPropertyEdit[A],
    "answerId"
  >
}
