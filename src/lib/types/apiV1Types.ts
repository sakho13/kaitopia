import { UserBaseDate, UserBaseInfo } from "./base/userTypes"

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
  params: ApiV1ErrorMap[K] extends { params: infer P } ? P : null
  columnName?: string
}

export type ApiV1OutTypeMap = {
  GetUser: {
    user: UserBaseInfo & UserBaseDate
  }
  RegisterUser: {
    user: UserBaseInfo & UserBaseDate
  }
}
