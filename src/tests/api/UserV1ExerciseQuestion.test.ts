/**
 * @jest-environment node
 */

import { GET } from "@/app/api/user/v1/exercise/question/route"
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
              questionId: expect.any(String),
              version: expect.any(Number),
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
              questionId: expect.any(String),
              version: expect.any(Number),
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
              questionId: expect.any(String),
              version: expect.any(Number),
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
              questionId: expect.any(String),
              version: expect.any(Number),
              title: expect.any(String),
            }),
          ]),
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
