/**
 * @jest-environment node
 */

import { GET } from "@/app/api/manage/v1/exercise/question/route"
import { TestUtility } from "@/tests/TestUtility"

const AdminUserEmail = "kaitopia-admin+001@kaitopia.com"
const AdminUserPassword = "password"
const UserUserEmail = "kaitopia-user+001@kaitopia.com"
const UserUserPassword = "password"

describe("API /api/manage/v1/exercise", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("アクセス権限チェック", () => {
    describe("GET", () => {
      test("ADMINユーザ 問題が取得できる", async () => {
        const token = await TestUtility.getTokenByEmailAndLogin(
          "kaitopia-admin+001@kaitopia.com",
          "password",
        )
        const result = await TestUtility.runApi(
          GET,
          "GET",
          "/api/manage/v1/exercise?exerciseId=intro_programming_1&questionId=intro_programming_1_1",
          {
            Authorization: `Bearer ${token}`,
          },
        )

        expect(result.ok).toBe(true)
        expect(result.status).toBe(200)
        const json = await result.json()
        expect(json).toEqual({
          success: true,
          data: expect.objectContaining({
            title: expect.any(String),
            questionType: expect.any(String),
            answerType: expect.any(String),
            isPublished: expect.any(Boolean),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            deletedAt: null,

            versions: expect.arrayContaining([]),
          }),
        })
      })

      test("USERユーザ 問題が取得できない", async () => {
        const token = await TestUtility.getTokenByEmailAndLogin(
          UserUserEmail,
          UserUserPassword,
        )
        const result = await TestUtility.runApi(
          GET,
          "GET",
          "/api/manage/v1/exercise?exerciseId=intro_programming_1&questionId=intro_programming_1_1",
          {
            Authorization: `Bearer ${token}`,
          },
        )

        expect(result.ok).toBe(false)
        expect(result.status).toBe(403)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: expect.arrayContaining([
            {
              message: "アクセス権限がありません",
            },
          ]),
        })
      })
    })
  })

  describe("バリデーション", () => {
    describe("GET", () => {
      test("exerciseIdが指定されていない", async () => {
        const token = await TestUtility.getTokenByEmailAndLogin(
          AdminUserEmail,
          AdminUserPassword,
        )
        const result = await TestUtility.runApi(
          GET,
          "GET",
          "/api/manage/v1/exercise/question",
          {
            Authorization: `Bearer ${token}`,
          },
        )

        expect(result.ok).toBe(false)
        expect(result.status).toBe(400)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: expect.arrayContaining([
            {
              message: "問題集IDは必須です",
            },
          ]),
        })
      })

      test("questionIdが指定されていない", async () => {
        const token = await TestUtility.getTokenByEmailAndLogin(
          AdminUserEmail,
          AdminUserPassword,
        )
        const result = await TestUtility.runApi(
          GET,
          "GET",
          "/api/manage/v1/exercise/question?exerciseId=it_passport_1",
          {
            Authorization: `Bearer ${token}`,
          },
        )

        expect(result.ok).toBe(false)
        expect(result.status).toBe(400)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: expect.arrayContaining([
            {
              message: "問題IDは必須です",
            },
          ]),
        })
      })
    })
  })
})
