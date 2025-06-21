/**
 * @jest-environment node
 */

import { GET, PATCH } from "@/app/api/manage/v1/question/route"
import { PATCH as PATCH_VERSION } from "@/app/api/manage/v1/question-version/route"
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
    describe("GET", () => {
      test("ADMINユーザ 問題が取得できる", async () => {
        const result = await TestUtility.runApi(
          GET,
          "GET",
          "/api/manage/v1/question?questionId=intro_programming_1_1",
          {
            Authorization: `Bearer ${token}`,
          },
        )
        expect(result.ok).toBe(true)
        expect(result.status).toBe(200)
        const json = await result.json()
        expect(json).toEqual({
          success: true,
          data: {
            question: expect.objectContaining({
              schoolId: expect.any(String),
              title: expect.any(String),
              questionId: "intro_programming_1_1",
              questionType: "TEXT",
              answerType: "SELECT",
            }),
            currentVersion: expect.any(Number),
            draftVersion: null,
            versions: expect.arrayContaining([
              expect.objectContaining({
                questionId: "intro_programming_1_1",
                version: expect.any(Number),
                content: expect.any(String),
                hint: expect.any(String),
                selection: expect.arrayContaining([
                  expect.objectContaining({
                    answerId: expect.any(String),
                    isCorrect: expect.any(Boolean),
                    selectContent: expect.any(String),
                  }),
                ]),
              }),
            ]),
          },
        })
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
        "/api/manage/v1/question?questionId=intro_programming_1_1",
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

    describe("PATCH", () => {
      test("ADMINユーザ 問題のタイトルを更新できる", async () => {
        const result = await TestUtility.runApi(
          PATCH,
          "PATCH",
          "/api/manage/v1/question?questionId=intro_programming_1_1",
          { Authorization: `Bearer ${token}` },
          { title: "更新タイトル" },
        )
        expect(result.ok).toBe(true)
        expect(result.status).toBe(200)
        const json = await result.json()
        expect(json).toEqual({
          success: true,
          questionId: "intro_programming_1_1",
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
          "/api/manage/v1/question?questionId=intro_programming_1_1",
          { Authorization: `Bearer ${userToken}` },
          { title: "更新タイトル" },
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

    describe("PATCH version", () => {
      test("ADMINユーザ アクティブバージョンを更新できる", async () => {
        const result = await TestUtility.runApi(
          PATCH_VERSION,
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
          questionId: "intro_programming_1_1",
        })
      })

      test("USERユーザ アクティブバージョンを更新できない", async () => {
        const userToken = await TestUtility.getTokenByEmailAndLogin(
          UserUserEmail,
          UserUserPassword,
        )
        const result = await TestUtility.runApi(
          PATCH_VERSION,
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
