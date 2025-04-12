import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"

describe("lib/classes/common/ApiV1Error", () => {
  test("インスタンス化できる", () => {
    const error = new ApiV1Error([
      {
        key: "AuthenticationError",
        params: null,
      },
    ])
    expect(error).toBeInstanceOf(ApiV1Error)
    expect(error.getStatus()).toBe(401)
    expect(error.getError()).toEqual([
      {
        message: "認証に失敗しました。再ログインしてください。",
      },
    ])
  })
})
