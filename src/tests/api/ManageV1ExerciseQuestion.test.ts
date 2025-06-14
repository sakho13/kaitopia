/**
 * @jest-environment node
 */

import { GET, POST } from "@/app/api/manage/v1/exercise/question/route"
import { POST as PostExercise } from "@/app/api/manage/v1/exercise/route"
import { TestUtility } from "@/tests/TestUtility"

const AdminUserEmail = "kaitopia-admin+001@kaitopia.com"
const AdminUserPassword = "password"
const UserUserEmail = "kaitopia-user+001@kaitopia.com"
const UserUserPassword = "password"

describe("API /api/manage/v1/exercise/question", () => {
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

  describe("CRUD", () => {
    test("問題集を作成し、問題を追加できる", async () => {
      const exerciseResult = await TestUtility.runApi(
        PostExercise,
        "POST",
        "/api/manage/v1/exercise",
        {
          Authorization: `Bearer ${token}`,
        },
        {
          schoolId: "kaitopia_1",
          property: {
            title: "新しい問題集",
            description: "問題集の説明",
          },
        },
      )
      expect(exerciseResult.ok).toBe(true)
      expect(exerciseResult.status).toBe(200)
      const exerciseJson = await exerciseResult.json()
      expect(exerciseJson).toEqual({
        success: true,
        data: {
          exercise: expect.objectContaining({
            exerciseId: expect.any(String),
          }),
        },
      })
      const exerciseId = exerciseJson.data.exercise.exerciseId

      const questionResult = await TestUtility.runApi(
        POST,
        "POST",
        `/api/manage/v1/exercise/question`,
        {
          Authorization: `Bearer ${token}`,
        },
        {
          exerciseId,
          title: "新しい問題",
          questionType: "TEXT",
          answerType: "SELECT",
          questionProperty: {
            content: "問題の内容",
            hint: "ヒントの内容",
          },
          questionAnswerProperty: {
            selection: [
              {
                selectContent: "選択肢1(正解)",
                isCorrect: true,
              },
              {
                selectContent: "選択肢2(不正解)",
                isCorrect: false,
              },
            ],
          },
        },
      )
      expect(questionResult.ok).toBe(true)
      expect(questionResult.status).toBe(200)
      const questionJson = await questionResult.json()
      expect(questionJson).toEqual({
        success: true,
        data: {
          questionId: expect.any(String),
        },
      })

      const questionGetResult = await TestUtility.runApi(
        GET,
        "GET",
        `/api/manage/v1/exercise?exerciseId=${exerciseId}&questionId=${questionJson.data.questionId}`,
        {
          Authorization: `Bearer ${token}`,
        },
      )
      expect(questionGetResult.ok).toBe(true)
      expect(questionGetResult.status).toBe(200)
      const questionGetJson = await questionGetResult.json()
      expect(questionGetJson).toEqual({
        success: true,
        data: expect.objectContaining({
          title: "新しい問題",
          questionType: "TEXT",
          answerType: "SELECT",
          isPublished: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          deletedAt: null,

          versions: expect.arrayContaining([
            {
              version: 1,
              content: "問題の内容",
              hint: "ヒントの内容",
            },
          ]),
        }),
      })
    })
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
              code: "RoleTypeError",
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
              code: "RequiredValueError",
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
              code: "RequiredValueError",
              message: "問題IDは必須です",
            },
          ]),
        })
      })
    })

    describe("POST", () => {
      test("exerciseIdが指定されていない", async () => {
        const result = await TestUtility.runApi(
          POST,
          "POST",
          "/api/manage/v1/exercise/question",
          {
            Authorization: `Bearer ${token}`,
          },
          {
            title: "新しい問題",
            questionType: "TEXT",
            answerType: "SELECT",
          },
        )

        expect(result.ok).toBe(false)
        expect(result.status).toBe(400)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: expect.arrayContaining([
            {
              code: "RequiredValueError",
              message: "問題集IDは必須です",
            },
          ]),
        })
      })

      test("titleが指定されていない", async () => {
        const result = await TestUtility.runApi(
          POST,
          "POST",
          "/api/manage/v1/exercise/question?exerciseId=intro_programming_1",
          {
            Authorization: `Bearer ${token}`,
          },
          {
            exerciseId: "intro_programming_1",
            questionType: "TEXT",
            answerType: "SELECT",
          },
        )

        expect(result.ok).toBe(false)
        expect(result.status).toBe(400)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: expect.arrayContaining([
            {
              code: "RequiredValueError",
              message: "問題タイトルは必須です",
            },
          ]),
        })
      })

      test("questionTypeが指定されていない", async () => {
        const result = await TestUtility.runApi(
          POST,
          "POST",
          "/api/manage/v1/exercise/question?exerciseId=intro_programming_1",
          {
            Authorization: `Bearer ${token}`,
          },
          {
            exerciseId: "intro_programming_1",
            title: "新しい問題",
            answerType: "SELECT",
          },
        )

        expect(result.ok).toBe(false)
        expect(result.status).toBe(400)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: expect.arrayContaining([
            {
              code: "RequiredValueError",
              message: "問題タイプは必須です",
            },
          ]),
        })
      })

      test("answerTypeが指定されていない", async () => {
        const result = await TestUtility.runApi(
          POST,
          "POST",
          "/api/manage/v1/exercise/question?exerciseId=intro_programming_1",
          {
            Authorization: `Bearer ${token}`,
          },
          {
            exerciseId: "intro_programming_1",
            title: "新しい問題",
            questionType: "TEXT",
          },
        )

        expect(result.ok).toBe(false)
        expect(result.status).toBe(400)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: expect.arrayContaining([
            {
              code: "RequiredValueError",
              message: "回答タイプは必須です",
            },
          ]),
        })
      })

      test("titleが空文字", async () => {
        const result = await TestUtility.runApi(
          POST,
          "POST",
          "/api/manage/v1/exercise/question?exerciseId=intro_programming_1",
          {
            Authorization: `Bearer ${token}`,
          },
          {
            exerciseId: "intro_programming_1",
            title: "",
            questionType: "TEXT",
            answerType: "SELECT",
          },
        )

        expect(result.ok).toBe(false)
        expect(result.status).toBe(400)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: expect.arrayContaining([
            {
              code: "InvalidFormatError",
              message: "問題タイトルの形式が不正です",
            },
          ]),
        })
      })
    })
  })
})
