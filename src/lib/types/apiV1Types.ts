import { ApiV1Error } from "../classes/common/ApiV1Error"
import {
  ExerciseBase,
  ExerciseBaseDate,
  ExerciseBaseIdentifier,
  ExerciseBaseProperty,
} from "./base/exerciseTypes"
import {
  QuestionAnswerContent,
  QuestionBase,
  QuestionBaseIdentifier,
  QuestionVersionBase,
} from "./base/questionTypes"
import {
  SchoolBase,
  SchoolBaseDate,
  SchoolBaseIdentity,
} from "./base/schoolTypes"
import {
  UserBaseDate,
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
        message: string
        columnName?: string
      }[]
    }

export const ApiV1ErrorMapObj = {
  RequiredValueError: {
    message: "{key}は必須です",
    params: ["key"],
  },
  InvalidFormatError: {
    message: "{key}の形式が不正です",
    params: ["key", "aaa"],
  },
  AuthenticationError: {
    message: "認証に失敗しました。再ログインしてください。",
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
    message: "システムエラーが発生しました。公式アナウンスを確認してください。",
    status: 500,
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
  PostManageQuestion: {
    schoolId: string
    question: QuestionBase
    content: QuestionVersionBase
  }

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

  PostUserExerciseAnswer: {
    exerciseId: string
    answers: QuestionAnswerContent[]
  }
}

export type ApiV1OutTypeMap = {
  GetUserInfo: {
    user: UserBaseInfo &
      ReplacedDateToString<UserBaseInfoOption> &
      ReplacedDateToString<Omit<UserBaseDate, "deletedAt">>
  }
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
    questions: (Omit<QuestionBaseIdentifier, "schoolId"> & QuestionBase)[]
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
   * GET /api/user/v1/exercise
   */
  GetUserExerciseInfo: {
    exercise: ExerciseBase
    property: ExerciseBaseProperty
    questions: []
  }
  // PostUserExerciseAnswer: {}
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
