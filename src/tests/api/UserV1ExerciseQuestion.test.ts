/**
 * @jest-environment node
 */

import { GET, PATCH } from "@/app/api/user/v1/exercise/question/route"
import { GET as GetUserV1ExerciseResults } from "@/app/api/user/v1/exercise/results/route"
import { TestUtility } from "../TestUtility"
import { DateUtility } from "@/lib/classes/common/DateUtility"
import { generateRandomLenNumber } from "@/lib/functions/generateRandomLenNumber"

describe("API /api/user/v1/exercise", () => {
  let newUserToken = ""

  beforeAll(async () => {
    const token = await TestUtility.getTokenByEmailAndSignUp(
      `test-user-${DateUtility.generateDateStringNow()}+${generateRandomLenNumber(
        3,
      )}@kaitopia.com`,
      "password",
    )
    const result = await TestUtility.signUpByToken(token)
    expect(result.ok).toBe(true)
    newUserToken = token
  })

  beforeEach(() => {
    jest.clearAllMocks()

    expect(newUserToken).toBeDefined()
    expect(newUserToken.length).toBeGreaterThan(0)
  })

  describe("GET", () => {
    test("回答前に詳細を見る", async () => {
      const result = await TestUtility.runApi(
        GET,
        "GET",
        "/api/user/v1/exercise/question?exerciseId=intro_programming_1&mode=show",
        {
          Authorization: `Bearer ${newUserToken}`,
        },
      )
      expect(result.ok).toBe(true)
      expect(result.status).toBe(200)
      const json = await result.json()
      expect(json).toEqual({
        success: true,
        data: expect.objectContaining({
          fn: null,
          exercise: expect.objectContaining({
            title: expect.any(String),
          }),
        }),
      })
      expect(json.data.questions).toBeDefined()
      expect(Array.isArray(json.data.questions)).toBe(true)
      expect(json.data.questions.length).toBeGreaterThan(0)
      expect(
        json.data.questions.every(
          (q: { answer: unknown }) =>
            typeof q.answer === "object" &&
            q.answer !== null &&
            Object.keys(q.answer).length === 0,
        ),
      ).toBe(true)
    })
  })

  describe("CRUD", () => {
    test("回答前に詳細を見る", async () => {
      const result = await TestUtility.runApi(
        GET,
        "GET",
        "/api/user/v1/exercise/question?exerciseId=intro_programming_1&mode=show",
        {
          Authorization: `Bearer ${newUserToken}`,
        },
      )
      expect(result.ok).toBe(true)
      expect(result.status).toBe(200)
      const json = await result.json()
      expect(json).toEqual({
        success: true,
        data: expect.objectContaining({
          fn: null,
          exercise: expect.objectContaining({
            title: expect.any(String),
          }),
          questions: expect.arrayContaining([
            expect.objectContaining({
              questionUserLogId: expect.any(String),
              title: expect.any(String),
            }),
          ]),
        }),
      })
    })

    test("回答のために問題を取得できる", async () => {
      const result = await TestUtility.runApi(
        GET,
        "GET",
        "/api/user/v1/exercise/question?exerciseId=intro_programming_1&mode=answer",
        {
          Authorization: `Bearer ${newUserToken}`,
        },
      )

      expect(result.ok).toBe(true)
      expect(result.status).toBe(200)
      const json = await result.json()
      expect(json).toEqual({
        success: true,
        data: expect.objectContaining({
          fn: "answer",
          exercise: expect.objectContaining({
            title: expect.any(String),
          }),
          questions: expect.arrayContaining([
            expect.objectContaining({
              questionUserLogId: expect.any(String),
              title: expect.any(String),
            }),
          ]),
        }),
      })
      expect(
        json.data.questions.every(
          (q: { answer: unknown }) =>
            typeof q.answer === "object" &&
            q.answer !== null &&
            Object.keys(q.answer).length > 0,
        ),
      ).toBe(true)
    })

    test("ゲストユーザで回答前に詳細を見る", async () => {
      const token = await TestUtility.getGuestToken()
      const loginResult = await TestUtility.signUpByToken(token)
      expect(loginResult.ok).toBe(true)
      const result = await TestUtility.runApi(
        GET,
        "GET",
        "/api/user/v1/exercise/question?exerciseId=intro_programming_1&mode=show",
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
          fn: null,
          exercise: expect.objectContaining({
            title: expect.any(String),
          }),
          questions: expect.arrayContaining([
            expect.objectContaining({
              questionUserLogId: expect.any(String),
              title: expect.any(String),
            }),
          ]),
        }),
      })
    })

    test("ゲストユーザで回答のために問題を取得できる", async () => {
      const token = await TestUtility.getGuestToken()
      const loginResult = await TestUtility.signUpByToken(token)
      expect(loginResult.ok).toBe(true)

      const result = await TestUtility.runApi(
        GET,
        "GET",
        "/api/user/v1/exercise/question?exerciseId=intro_programming_1&mode=answer",
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
          fn: "answer",
          exercise: expect.objectContaining({
            title: expect.any(String),
          }),
          questions: expect.arrayContaining([
            expect.objectContaining({
              questionUserLogId: expect.any(String),
              title: expect.any(String),
            }),
          ]),
        }),
      })
    })

    test("通常ユーザで回答を送信しログとして記録される", async () => {
      const exerciseId = "intro_programming_1"
      const token = await TestUtility.getTokenByEmailAndSignUp(
        `test-user-${DateUtility.generateDateStringNow()}+${generateRandomLenNumber(
          3,
        )}@kaitopia.com`,
        "password",
      )
      await TestUtility.signUpByToken(token)
      const beforeResult = await TestUtility.runApi(
        GetUserV1ExerciseResults,
        "GET",
        "/api/user/v1/exercise/results?ignoreInProgress=false&count=10&page=1",
        {
          Authorization: `Bearer ${token}`,
        },
      )
      expect(beforeResult.ok).toBe(true)
      expect(beforeResult.status).toBe(200)
      const beforeJson = await beforeResult.json()
      expect(beforeJson).toEqual({
        success: true,
        data: expect.objectContaining({
          answerLogSheets: [],
          nextPage: null,
          totalCount: 0,
        }),
      })

      const startAnswerResult = await TestUtility.runApi(
        GET,
        "GET",
        `/api/user/v1/exercise/question?exerciseId=${exerciseId}&mode=answer`,
        {
          Authorization: `Bearer ${token}`,
        },
      )
      expect(startAnswerResult.ok).toBe(true)
      expect(startAnswerResult.status).toBe(200)
      const startAnswerJson = await startAnswerResult.json()
      expect(startAnswerJson).toEqual({
        success: true,
        data: expect.objectContaining({
          fn: "answer",
          answerLogSheetId: expect.any(String),
          exercise: expect.objectContaining({
            title: expect.any(String),
          }),
          questions: expect.arrayContaining([
            expect.objectContaining({
              questionUserLogId: expect.any(String),
              title: expect.any(String),
              content: expect.any(String),
            }),
          ]),
        }),
      })

      const answerLogSheetId = startAnswerJson.data.answerLogSheetId
      const firstQuestionUserLogId = startAnswerJson.data.questions.find(
        (q: { questionId: string }) => q.questionId === "intro_programming_1_1",
      ).questionUserLogId

      const patchResult = await TestUtility.runApi(
        PATCH,
        "PATCH",
        "/api/user/v1/exercise/question",
        {
          Authorization: `Bearer ${token}`,
        },
        {
          answerLogSheetId,
          questionUserLogId: firstQuestionUserLogId,
          exerciseId,
          answer: {
            type: "SELECT",
            answerId: "3",
          },
        },
      )
      expect(patchResult.ok).toBe(true)
      expect(patchResult.status).toBe(200)
      const patchJson = await patchResult.json()
      expect(patchJson).toEqual(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            fn: "answer",
            answerLogSheetId: expect.any(String),
            exerciseId,
            skipped: false,
            totalQuestionCount: startAnswerJson.data.questions.length,
            totalAnsweredCount: 1,
            isCorrect: true,
            questionScore: 100,
          }),
        }),
      )

      const afterResult = await TestUtility.runApi(
        GetUserV1ExerciseResults,
        "GET",
        "/api/user/v1/exercise/results?ignoreInProgress=false&count=10&page=1",
        {
          Authorization: `Bearer ${token}`,
        },
      )
      expect(afterResult.ok).toBe(true)
      expect(afterResult.status).toBe(200)
      const afterJson = await afterResult.json()
      expect(afterJson).toEqual({
        success: true,
        data: expect.objectContaining({
          answerLogSheets: expect.arrayContaining([
            expect.objectContaining({
              answerLogSheetId: startAnswerJson.data.answerLogSheetId,
              exerciseId,
              totalQuestionCount: startAnswerJson.data.questions.length,
            }),
          ]),
          nextPage: null,
          totalCount: 1,
        }),
      })
    })
  })

  describe("バリデーション", () => {
    describe("GET", () => {
      test("exerciseIdが指定されていない", async () => {
        const result = await TestUtility.runApi(
          GET,
          "GET",
          "/api/user/v1/exercise",
          {
            Authorization: `Bearer ${newUserToken}`,
          },
        )
        expect(result.ok).toBe(false)
        expect(result.status).toBe(404)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: [
            {
              code: "NotFoundError",
              message:
                "リソースが見つかりません。再読み込みしても解決しない場合は、お問い合わせください。",
            },
          ],
        })
      })

      test("modeが指定されていない", async () => {
        const result = await TestUtility.runApi(
          GET,
          "GET",
          "/api/user/v1/exercise?exerciseId=exerciseId",
          {
            Authorization: `Bearer ${newUserToken}`,
          },
        )
        expect(result.ok).toBe(false)
        expect(result.status).toBe(404)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: [
            {
              code: "NotFoundError",
              message:
                "リソースが見つかりません。再読み込みしても解決しない場合は、お問い合わせください。",
            },
          ],
        })
      })

      test("modeが不正", async () => {
        const result = await TestUtility.runApi(
          GET,
          "GET",
          "/api/user/v1/exercise?exerciseId=exerciseId&mode=invalid",
          {
            Authorization: `Bearer ${newUserToken}`,
          },
        )
        expect(result.ok).toBe(false)
        expect(result.status).toBe(404)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: [
            {
              code: "NotFoundError",
              message:
                "リソースが見つかりません。再読み込みしても解決しない場合は、お問い合わせください。",
            },
          ],
        })
      })
    })
  })
})
