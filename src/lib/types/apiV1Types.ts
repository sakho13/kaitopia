import { ApiV1Error } from "../classes/common/ApiV1Error"
import {
  ExerciseBase,
  ExerciseBaseDate,
  ExerciseBaseIdentifier,
  ExerciseBaseProperty,
} from "./base/exerciseTypes"
import {
  SchoolBase,
  SchoolBaseDate,
  SchoolBaseIdentity,
} from "./base/schoolTypes"
import { UserBaseInfo } from "./base/userTypes"
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
  GetManageExercises: {
    // クエリパラメータ
    schoolId?: string
  }

  PostManageExercise: {
    schoolId: string
    property: ExerciseBase
  }

  PostUserExerciseAnswer: {
    exerciseId: string
  }
}

export type ApiV1OutTypeMap = {
  GetUser: {
    user: ReplacedDateToString<UserBaseInfo>
  }
  RegisterUser: {
    state: "register" | "login"
    user: ReplacedDateToString<UserBaseInfo>
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
    baseInfo: ReplacedDateToString<UserBaseInfo>
    canAccessManagePage: boolean
  }
  GetManageOwnSchools: {
    schools: (SchoolBaseIdentity &
      SchoolBase &
      ReplacedDateToString<SchoolBaseDate>)[]
  }
  GetManageExercises: {
    exercises: (ExerciseBaseIdentifier &
      ExerciseBase &
      ReplacedDateToString<ExerciseBaseDate>)[]
  }
  PostManageExercise: {
    exercise: ExerciseBaseIdentifier &
      ExerciseBase &
      ReplacedDateToString<ExerciseBaseDate>
  }

  GetUserExerciseInfo: {
    exercise: ExerciseBase
    property: ExerciseBaseProperty
    questions: []
  }
  PostUserExerciseAnswer: {}
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
