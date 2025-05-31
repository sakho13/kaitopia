import { ApiV1Error } from "../classes/common/ApiV1Error"
import {
  AnswerLogSheetBase,
  AnswerLogSheetBaseDate,
} from "./base/answerLogSheetTypes"
import {
  ExerciseBase,
  ExerciseBaseDate,
  ExerciseBaseIdentifier,
  ExerciseBaseProperty,
} from "./base/exerciseTypes"
import {
  QuestionAnswerContent,
  QuestionBase,
  QuestionBaseDate,
  QuestionBaseEditState,
  QuestionBaseIdentifier,
  QuestionBasePublishedState,
  QuestionBaseStatus,
  QuestionForResult,
  QuestionForUser,
  QuestionVersionBase,
  QuestionVersionBaseIdentifier,
} from "./base/questionTypes"
import {
  SchoolBase,
  SchoolBaseDate,
  SchoolBaseIdentity,
} from "./base/schoolTypes"
import {
  EditableUserInfo,
  UserBaseDate,
  UserBaseIdentity,
  UserBaseInfo,
  UserBaseInfoOption,
} from "./base/userTypes"
import { ReplacedDateToString } from "./common/ReplacedDateToString"

export type ApiV1OutBase<R> =
  | {
      success: true
      data: R
    }
  | {
      success: false
      errors: {
        code: keyof typeof ApiV1ErrorMapObj
        message: string
        columnName?: string
      }[]
    }

export const ApiV1ErrorMapObj = {
  RequiredValueError: {
    message: "{key}は必須です",
    params: ["key"],
    status: 400,
  },
  InvalidFormatError: {
    message: "{key}の形式が不正です",
    params: ["key"],
    status: 400,
  },
  AuthenticationError: {
    message: "認証に失敗しました。再ログインしてください。",
    status: 401,
  },
  TokenExpiredError: {
    // ユーザに表示してはならない
    message: "認証有効期限が切れました。再ログインしてください。",
    status: 401,
  },
  RoleTypeError: {
    message: "アクセス権限がありません",
    status: 403,
  },
  NotFoundError: {
    message:
      "リソースが見つかりません。再読み込みしても解決しない場合は、お問い合わせください。",
    status: 404,
  },
  SystemError: {
    // ユーザに表示してはならない
    message: "システムエラーが発生しました。公式アナウンスを確認してください。",
    status: 500,
  },

  // 問題集固有エラー
  ExerciseCannotSkipError: {
    message: "この問題集はスキップできません",
    status: 400,
  },
  ExerciseUnAnsweredError: {
    message: "未回答の問題があります",
    status: 400,
  },
  ExerciseAlreadyAnsweredError: {
    message: "すでに回答済みの問題集です",
    status: 400,
  },
  ExerciseGuestLimitError: {
    message: "問題の回答上限に達しました（上限: {limit}）",
    params: ["limit"],
    status: 400,
  },
} as const

export type ApiV1ErrorMap = {
  [key in keyof typeof ApiV1ErrorMapObj]: {
    message: (typeof ApiV1ErrorMapObj)[key]["message"]
    params: (typeof ApiV1ErrorMapObj)[key] extends {
      params: infer P
    }
      ? P
      : null
  }
}

export type ApiV1ErrorInput<K extends keyof ApiV1ErrorMap> = {
  key: K
  params: ApiV1ErrorMap[K]["params"] extends infer P
    ? P extends readonly string[]
      ? { [K in P[number]]: string }
      : null
    : null
  columnName?: string
}

export type ApiV1InTypeMap = {
  /**
   * PATCH /api/user/v1/info
   */
  PatchUserInfo: {
    user: Partial<ReplacedDateToString<EditableUserInfo>>
  }
  /**
   * GET /api/manage/v1/exercise?exerciseId=xxxx
   */
  GetManageExercise: {
    exerciseId: string
  }

  GetManageExercises: {
    // クエリパラメータ
    schoolId?: string
  }

  PostManageExercise: {
    schoolId: string
    property: ExerciseBase
  }
  PatchManageExercise: {
    // クエリパラメータ: exerciseId
    title?: string
    description?: string
    isPublished?: boolean
  }
  PostManageQuestion: {
    schoolId: string
    question: QuestionBase
    content: QuestionVersionBase
  }
  /**
   * DELETE /api/manage/v1/exercise
   */
  DeleteManageExercise: null

  /**
   * GET /api/user/v1/exercise?exerciseId=xxxx
   */
  GetUserExerciseInfo: {
    exerciseId: string
  }

  /**
   * POST /api/user/v1/user/login
   */
  PostUserLogin: null

  /**
   * 一括採点or結果を取得したい場合に実行される
   *
   * POST /api/user/v1/exercise/question
   */
  PostUserExerciseQuestion: {
    answerLogSheetId: string
    exerciseId: string
  }
  /**
   * PATCH /api/user/v1/exercise/question
   */
  PatchUserExerciseQuestion: {
    answerLogSheetId: string
    questionUserLogId: string
    exerciseId: string
    answer: QuestionAnswerContent
  }
}

export type ApiV1OutTypeMap = {
  GetUserInfo: {
    user: UserBaseInfo &
      ReplacedDateToString<UserBaseInfoOption> &
      ReplacedDateToString<Omit<UserBaseDate, "deletedAt">>
  }
  PatchUserInfo: ApiV1OutTypeMap["GetUserInfo"]
  PostUserLogin: {
    state: "register" | "login"
    user: UserBaseInfo & ReplacedDateToString<UserBaseInfoOption>
    isGuest: boolean
  }

  GetRecommendExercise: {
    recommendExercises: {
      id: string
      title: string
      description: string
    }[]
  }
  /**
   * GET /api/user/v1/user-info
   */
  GetUserConfig: {
    userInfo: UserBaseInfo & ReplacedDateToString<UserBaseInfoOption>
    canAccessManagePage: boolean
    isGuest: boolean
    schools: (SchoolBaseIdentity &
      SchoolBase &
      ReplacedDateToString<SchoolBaseDate>)[]
  }
  /**
   * GET /api/user/v1/result/logs?count=10&page=1
   */
  GetUserResultLog: {
    resultLogs: {
      answerLogSheetId: string
      exercise: { exerciseId: string; title: string } | null
      isInProgress: boolean
      totalQuestionCount: number
      totalCorrectCount: number
      totalIncorrectCount: number
      totalUnansweredCount: number
      createdAt: string
    }[]
    nextPage: number | null
    totalCount: number
  }

  /**
   * GET /api/user/v1/exercise
   */
  GetUserExerciseInfo: {
    exercise: ExerciseBase & Omit<ExerciseBaseProperty, "schoolId">
    questions: QuestionBase[]
  }
  /**
   * GET /api/user/v1/exercise/question?exerciseId=xxxx&mode=xxxx
   */
  GetUserExerciseQuestion: {
    fn: "answer" | "back" | null
    answerLogSheetId: string | null
    exercise: ExerciseBase & Omit<ExerciseBaseProperty, "schoolId">
    questions: QuestionForUser[]
  }
  /**
   * POST /api/user/v1/exercise/question
   */
  PostUserExerciseQuestion: {
    /**
     * * `answer`: 採点に必要な情報が不足している
     */
    fn: "answer" | null
    answerLogSheetId: string
    exerciseId: string
    result: AnswerLogSheetBase & { totalQuestionCount: number }
  }
  /**
   * PATCH /api/user/v1/exercise/question
   */
  PatchUserExerciseQuestion: {
    /**
     * * `answer`: 採点に必要な情報が不足している
     * * `total-result`: すべて回答済み
     */
    fn: "answer" | "total-result" | null
    answerLogSheetId: string
    exerciseId: string
    skipped: boolean
    totalQuestionCount: number
    totalAnsweredCount: number
    /**
     * 一括採点の場合は `null` を返す
     *
     * TYPEが`SELECT/MULTI_SELECT`の場合にTrue/falseを返す
     */
    isCorrect: boolean | null
    /**
     * 一括採点の場合は `null` を返す
     */
    questionScore: number | null
  }
  /**
   * GET /api/user/v1/exercise/results?ignoreInProgress=xxx?count=xxx&page=xxx
   */
  GetUserExerciseResults: {
    answerLogSheets: ({
      answerLogSheetId: string
      exerciseId: string
      totalQuestionCount: number
    } & AnswerLogSheetBase &
      ReplacedDateToString<AnswerLogSheetBaseDate>)[]
    nextPage: number | null
    totalCount: number
  }
  /**
   * GET /api/user/v1/exercise/result/log-sheet?answerLogSheetId=xxxx
   */
  GetUserResultLogSheet: {
    answerLogSheetId: string
    detail: AnswerLogSheetBase & {
      questionUserLogs: QuestionForResult[]
    }
    exercise: (ExerciseBaseIdentifier & ExerciseBase) | null
    createdAt: string
    updatedAt: string
  }

  /**
   * GET /api/manage/v1/own-schools
   */
  GetManageOwnSchools: {
    schools: (SchoolBaseIdentity &
      SchoolBase &
      ReplacedDateToString<SchoolBaseDate>)[]
  }
  /**
   * GET /api/manage/v1/exercise
   */
  GetManageExercise: {
    exercise: ExerciseBaseIdentifier &
      ExerciseBase &
      ExerciseBaseProperty &
      ReplacedDateToString<ExerciseBaseDate> & { questionCount: number }
    questions: (Omit<QuestionBaseIdentifier, "schoolId"> &
      QuestionBase &
      QuestionBasePublishedState &
      QuestionBaseEditState)[]
  }
  /**
   * GET /api/manage/v1/exercises
   */
  GetManageExercises: {
    exercises: (ExerciseBaseIdentifier &
      ExerciseBase &
      ExerciseBaseProperty &
      ReplacedDateToString<ExerciseBaseDate> & { questionCount: number })[]
    /**
     * @description nullの場合は次のページがないことを示す
     */
    nextPage: number | null
    totalCount: number
  }
  /**
   * POST /api/manage/v1/exercise
   */
  PostManageExercise: {
    exercise: ExerciseBaseIdentifier &
      ExerciseBase &
      ReplacedDateToString<ExerciseBaseDate>
  }
  /**
   * PATCH /api/manage/v1/exercise
   */
  PatchManageExercise: {
    exercise: ExerciseBaseIdentifier &
      ExerciseBase &
      ReplacedDateToString<ExerciseBaseDate>
  }
  /**
   * DELETE /api/manage/v1/exercise
   */
  DeleteManageExercise: {
    exerciseId: string
  }
  /**
   * GET /api/manage/v1/exercise/question?exerciseId=xxxx&questionId=xxxx
   */
  GetManageExerciseQuestion: {
    versions: (Omit<QuestionVersionBaseIdentifier, "questionId"> &
      QuestionVersionBase)[]
  } & QuestionBase &
    QuestionBaseStatus &
    ReplacedDateToString<QuestionBaseDate>
  /**
   * GET /api/manage/v1/users?count=10&page=1
   */
  GetManageUsers: {
    users: (UserBaseIdentity &
      UserBaseInfo & {
        isGuest: boolean
      } & ReplacedDateToString<UserBaseInfoOption> &
      ReplacedDateToString<UserBaseDate>)[]
    nextPage: number | null
    totalCount: number
  }
}

export type ApiV1ValidationResult<S, E extends keyof ApiV1ErrorMap> =
  | {
      error: ApiV1Error<E>
      result: null
    }
  | {
      error: null
      result: S
    }
