/**
 * @jest-environment node
 */

import { GET } from "@/app/api/manage/v1/question-groups/route"
import { TestUtility } from "@/tests/TestUtility"

const AdminUserEmail = "kaitopia-admin+001@kaitopia.com"
const AdminUserPassword = "password"
const UserUserEmail = "kaitopia-user+001@kaitopia.com"
const UserUserPassword = "password"

describe("API /api/manage/v1/question-groups", () => {
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
    describe("GET", () => {
      test("ADMINユーザ 問題が取得できる", async () => {
        const result = await TestUtility.runApi(
          GET,
          "GET",
          "/api/manage/v1/question-groups?schoolId=kaitopia_1",
          {
            Authorization: `Bearer ${token}`,
          },
        )

        const json = await result.json()
        expect(json).toEqual({
          success: true,
          data: {
            questionGroups: expect.arrayContaining([
              expect.objectContaining({
                questionGroupId: "intro_programming_1_algorithm",
                schoolId: "kaitopia_1",
                name: "アルゴリズム",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              }),
              expect.objectContaining({
                questionGroupId: "intro_programming_1_hardware",
                schoolId: "kaitopia_1",
                name: "ハードウェア",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              }),
            ]),
          },
        })

        expect(result.ok).toBe(true)
        expect(result.status).toBe(200)
      })
    })

    test("USERユーザ 問題が取得できない", async () => {
      const userToken = await TestUtility.getTokenByEmailAndLogin(
        UserUserEmail,
        UserUserPassword,
      )
      const result = await TestUtility.runApi(
        GET,
        "GET",
        "/api/manage/v1/question-groups?schoolId=kaitopia_1",
        {
          Authorization: `Bearer ${userToken}`,
        },
      )
      expect(result.ok).toBe(false)
      expect(result.status).toBe(403)
      const json = await result.json()
      expect(json).toEqual({
        success: false,
        errors: expect.arrayContaining([
          {
            code: "RoleTypeError",
            message: "アクセス権限がありません",
          },
        ]),
      })
    })
  })

  describe("バリデーション", () => {
    describe("GET", () => {})
  })
})
