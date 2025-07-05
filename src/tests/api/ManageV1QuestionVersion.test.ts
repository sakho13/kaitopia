/**
 * @jest-environment node
 */

import { PATCH } from "@/app/api/manage/v1/question-version/route"
import { TestUtility } from "@/tests/TestUtility"

const AdminUserEmail = "kaitopia-admin+001@kaitopia.com"
const AdminUserPassword = "password"
const UserUserEmail = "kaitopia-user+001@kaitopia.com"
const UserUserPassword = "password"

describe("API /api/manage/v1/question", () => {
  let token = ""

  beforeAll(async () => {
    token = await TestUtility.getTokenByEmailAndLogin(
      AdminUserEmail,
      AdminUserPassword,
    )
  })
  beforeEach(() => {
    jest.clearAllMocks()
  })
  afterAll(async () => {
    token = ""
  })

  describe("CRUD", () => {})

  describe("アクセス権限チェック", () => {
    describe("PATCH", () => {
      test("ADMINユーザ 問題のタイトルを更新できる", async () => {
        const result = await TestUtility.runApi(
          PATCH,
          "PATCH",
          "/api/manage/v1/question-version",
          { Authorization: `Bearer ${token}` },
          { questionId: "intro_programming_1_1", version: 1 },
        )
        expect(result.ok).toBe(true)
        expect(result.status).toBe(200)
        const json = await result.json()
        expect(json).toEqual({
          success: true,
          data: {
            questionId: "intro_programming_1_1",
            currentVersion: 1,
          },
        })
      })

      test("USERユーザ 問題のタイトルを更新できない", async () => {
        const userToken = await TestUtility.getTokenByEmailAndLogin(
          UserUserEmail,
          UserUserPassword,
        )
        const result = await TestUtility.runApi(
          PATCH,
          "PATCH",
          "/api/manage/v1/question-version",
          { Authorization: `Bearer ${userToken}` },
          { questionId: "intro_programming_1_1", version: 1 },
        )
        expect(result.ok).toBe(false)
        expect(result.status).toBe(403)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: expect.arrayContaining([
            { code: "RoleTypeError", message: "アクセス権限がありません" },
          ]),
        })
      })
    })
  })

  describe("バリデーション", () => {
    describe("GET", () => {})
  })
})
