import { hasErrorCodeInApiResponse } from "@/lib/functions/hasErrorCodeInApiResponse"
import { ApiV1OutBase } from "@/lib/types/apiV1Types"

describe("lib/functions/hasErrorCodeInApiResponse", () => {
  test("APIレスポンスにエラーコードが含まれている", () => {
    const response: ApiV1OutBase<unknown> = {
      success: false,
      errors: [
        {
          code: "AuthenticationError",
          message: "認証に失敗しました。再ログインしてください。",
        },
      ],
    }

    expect(hasErrorCodeInApiResponse(response, "AuthenticationError")).toBe(
      true,
    )
  })

  test("複数のエラーコードが含まれている", () => {
    const response: ApiV1OutBase<unknown> = {
      success: false,
      errors: [
        {
          code: "DeletedUserError",
          message:
            "このアカウントは削除されています。再度利用する場合は、管理者にお問い合わせください。",
        },
        {
          code: "AuthenticationError",
          message: "認証に失敗しました。再ログインしてください。",
        },
      ],
    }

    expect(hasErrorCodeInApiResponse(response, "AuthenticationError")).toBe(
      true,
    )
    expect(hasErrorCodeInApiResponse(response, "DeletedUserError")).toBe(true)
    expect(hasErrorCodeInApiResponse(response, "NotFoundError")).toBe(false)
  })

  test("成功レスポンスではエラーコードが含まれていない", () => {
    const response: ApiV1OutBase<unknown> = {
      success: true,
      data: {},
    }

    expect(hasErrorCodeInApiResponse(response, "AuthenticationError")).toBe(
      false,
    )
    expect(hasErrorCodeInApiResponse(response, "DeletedUserError")).toBe(false)
  })
})
