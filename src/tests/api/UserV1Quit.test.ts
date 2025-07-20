/**
 * @jest-environment node
 */

import { POST } from "@/app/api/user/v1/quit/route"
import { GET as GetUserInfo } from "@/app/api/user/v1/info/route"
import { TestUtility } from "@/tests/TestUtility"

describe("API /api/user/v1/quit", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe("シナリオ", () => {
    test("ユーザが退会できる", async () => {
      const randEmail = TestUtility.getRandomEmail()
      const token = await TestUtility.getTokenByEmailAndSignUp(
        randEmail,
        "password",
      )
      expect(token).toBeDefined()

      const signupResult = await TestUtility.signUpByToken(token)

      expect(signupResult.ok).toBe(true)
      const signupResultJson = await signupResult.json()
      expect(signupResultJson.success).toBe(true)
      expect(signupResultJson.data.user).toBeDefined()
      expect(signupResultJson.data.user).toBeDefined()
      expect(signupResultJson.data.user.id).toBeDefined()

      const quitResult = await TestUtility.runApi(
        POST,
        "POST",
        "/api/user/v1/quit",
        {
          Authorization: `Bearer ${token}`,
        },
        {
          reason: "退会理由のテスト",
        },
      )

      expect(quitResult.ok).toBe(true)
      const quitResultJson = await quitResult.json()
      expect(quitResultJson.success).toBe(true)
      expect(quitResultJson.data.deletedAt).toBeDefined()
      expect(quitResultJson.data.quitCode).toBeDefined()
      expect(quitResultJson.data.quitCode).toEqual(expect.any(String))
      expect(quitResultJson.data.quitCode.length).toBeGreaterThan(0)

      // 退会後のユーザ情報を取得してエラーになる
      const userInfoResult = await TestUtility.runApi(
        GetUserInfo,
        "GET",
        "/api/user/v1/info",
        {
          Authorization: `Bearer ${token}`,
        },
      )

      expect(userInfoResult.status).toBe(403)
      const userInfoJson = await userInfoResult.json()
      expect(userInfoJson.success).toBe(false)
      expect(userInfoJson.errors).toEqual([
        {
          code: "DeletedUserError",
          message:
            "このアカウントは削除されています。再度利用する場合は、管理者にお問い合わせください。",
        },
      ])
    })
  })

  describe("バリデーション", () => {
    test("退会理由が空文字の場合にエラーを返す", async () => {
      const randEmail = TestUtility.getRandomEmail()
      const token = await TestUtility.getTokenByEmailAndSignUp(
        randEmail,
        "password",
      )
      expect(token).toBeDefined()
      await TestUtility.signUpByToken(token)

      const result = await TestUtility.runApi(
        POST,
        "POST",
        "/api/user/v1/quit",
        {
          Authorization: `Bearer ${token}`,
        },
        {
          reason: "",
        },
      )
      const json = await result.json()
      expect(json).toEqual({
        success: false,
        errors: [
          { code: "InvalidFormatError", message: "退会理由の形式が不正です" },
        ],
      })
      expect(result.status).toBe(400)
    })

    test("退会理由が未指定の場合にエラーを返す", async () => {
      const randEmail = TestUtility.getRandomEmail()
      const token = await TestUtility.getTokenByEmailAndSignUp(
        randEmail,
        "password",
      )
      expect(token).toBeDefined()
      await TestUtility.signUpByToken(token)

      const result = await TestUtility.runApi(
        POST,
        "POST",
        "/api/user/v1/quit",
        {
          Authorization: `Bearer ${token}`,
        },
        {},
      )
      const json = await result.json()
      expect(json).toEqual({
        success: false,
        errors: [
          { code: "InvalidFormatError", message: "退会理由の形式が不正です" },
        ],
      })
      expect(result.status).toBe(400)
    })
  })
})
