/**
 * @jest-environment node
 */

import { GET } from "@/app/api/user/v1/result/log-sheet/route"
import {
  GET as GetUserV1ExerciseQuestion,
  PATCH as PatchUserV1ExerciseQuestion,
  POST as PostUserV1ExerciseQuestion,
} from "@/app/api/user/v1/exercise/question/route"
import { TestUtility } from "../TestUtility"

describe("API /api/user/v1/result/log-sheet", () => {
  let newUserToken = ""

  beforeAll(async () => {
    const token = await TestUtility.getGuestToken()
    newUserToken = token
    const resultSignUp = await TestUtility.signUpByToken(token)
    expect(resultSignUp.ok).toBe(true)
    expect(resultSignUp.status).toBe(200)
  })

  beforeEach(() => {
    jest.clearAllMocks()

    expect(newUserToken).toBeDefined()
    expect(newUserToken.length).toBeGreaterThan(0)
  })

  describe("バリデーション", () => {
    describe("GET", () => {
      test("answerLogSheetIdが指定されていない", async () => {
        const result = await TestUtility.runApi(
          GET,
          "GET",
          "/api/user/v1/result/log-sheet",
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

      test("answerLogSheetIdが空文字", async () => {
        const result = await TestUtility.runApi(
          GET,
          "GET",
          "/api/user/v1/result/log-sheet?answerLogSheetId=",
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

      test("answerLogSheetIdが存在しないID", async () => {
        const result = await TestUtility.runApi(
          GET,
          "GET",
          "/api/user/v1/result/log-sheet?answerLogSheetId=1234567890",
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

  describe("CRUD", () => {
    test("問題集を回答前の状態で取得し回答履歴が取得できない", async () => {
      const resultGetExerciseQuestion = await TestUtility.runApi(
        GetUserV1ExerciseQuestion,
        "GET",
        "/api/user/v1/exercise/question?exerciseId=intro_programming_1&mode=answer",
        {
          Authorization: `Bearer ${newUserToken}`,
        },
      )
      expect(resultGetExerciseQuestion.ok).toBe(true)
      expect(resultGetExerciseQuestion.status).toBe(200)
      const jsonGetExerciseQuestion = await resultGetExerciseQuestion.json()
      expect(jsonGetExerciseQuestion.data.answerLogSheetId).toBeDefined()
      expect(jsonGetExerciseQuestion.data.answerLogSheetId).toEqual(
        expect.any(String),
      )

      const answerLogSheetId = jsonGetExerciseQuestion.data.answerLogSheetId

      const result = await TestUtility.runApi(
        GET,
        "GET",
        `/api/user/v1/result/log-sheet?answerLogSheetId=${answerLogSheetId}`,
        {
          Authorization: `Bearer ${newUserToken}`,
        },
      )
      expect(result.ok).toBe(false)
      expect(result.status).toBe(400)
      const json = await result.json()
      expect(json).toEqual({
        success: false,
        errors: [
          {
            code: "ExerciseUnAnsweredError",
            message: "未回答の問題があります",
          },
        ],
      })
    })

    test("未回答の問題がある状態では回答履歴が取得できない", async () => {
      const token = await TestUtility.getGuestToken()
      const resultSignUp = await TestUtility.signUpByToken(token)
      expect(resultSignUp.ok).toBe(true)
      expect(resultSignUp.status).toBe(200)

      const exerciseId = "intro_programming_1"
      const resultGetExerciseQuestion = await TestUtility.runApi(
        GetUserV1ExerciseQuestion,
        "GET",
        `/api/user/v1/exercise/question?exerciseId=${exerciseId}&mode=answer`,
        {
          Authorization: `Bearer ${token}`,
        },
      )
      expect(resultGetExerciseQuestion.ok).toBe(true)
      expect(resultGetExerciseQuestion.status).toBe(200)
      const jsonGetExerciseQuestion = await resultGetExerciseQuestion.json()
      expect(jsonGetExerciseQuestion.data.answerLogSheetId).toBeDefined()
      expect(jsonGetExerciseQuestion.data.answerLogSheetId).toEqual(
        expect.any(String),
      )
      const answerLogSheetId = jsonGetExerciseQuestion.data.answerLogSheetId

      const firstQuestion = jsonGetExerciseQuestion.data.questions.find(
        (q: { questionId: string }) => q.questionId === "intro_programming_1_1",
      )
      expect(firstQuestion).toBeDefined()
      expect(firstQuestion.questionUserLogId).toBeDefined()

      const resultPatchExerciseQuestion = await TestUtility.runApi(
        PatchUserV1ExerciseQuestion,
        "PATCH",
        "/api/user/v1/exercise/question",
        {
          Authorization: `Bearer ${token}`,
        },
        {
          answerLogSheetId,
          questionUserLogId: firstQuestion.questionUserLogId,
          exerciseId,
          answer: {
            type: "SELECT",
            answerId: "3",
          },
        },
      )
      expect(resultPatchExerciseQuestion.ok).toBe(true)
      expect(resultPatchExerciseQuestion.status).toBe(200)

      const result = await TestUtility.runApi(
        GET,
        "GET",
        `/api/user/v1/result/log-sheet?answerLogSheetId=${answerLogSheetId}`,
        {
          Authorization: `Bearer ${token}`,
        },
      )
      expect(result.ok).toBe(false)
      expect(result.status).toBe(400)
      const json = await result.json()
      expect(json).toEqual({
        success: false,
        errors: [
          {
            code: "ExerciseUnAnsweredError",
            message: "未回答の問題があります",
          },
        ],
      })
    })

    test("すべての問題を回答して回答履歴が取得できる", async () => {
      const token = await TestUtility.getGuestToken()
      const resultSignUp = await TestUtility.signUpByToken(token)
      expect(resultSignUp.ok).toBe(true)
      expect(resultSignUp.status).toBe(200)

      const exerciseId = "intro_programming_1"
      const resultGetExerciseQuestion = await TestUtility.runApi(
        GetUserV1ExerciseQuestion,
        "GET",
        `/api/user/v1/exercise/question?exerciseId=${exerciseId}&mode=answer`,
        {
          Authorization: `Bearer ${token}`,
        },
      )
      expect(resultGetExerciseQuestion.ok).toBe(true)
      expect(resultGetExerciseQuestion.status).toBe(200)
      const jsonGetExerciseQuestion = await resultGetExerciseQuestion.json()
      expect(jsonGetExerciseQuestion.data.answerLogSheetId).toBeDefined()
      expect(jsonGetExerciseQuestion.data.answerLogSheetId).toEqual(
        expect.any(String),
      )
      const answerLogSheetId = jsonGetExerciseQuestion.data.answerLogSheetId

      await Promise.all(
        jsonGetExerciseQuestion.data.questions.map(
          async (q: { questionUserLogId: string; answerType: string }) => {
            expect(q.questionUserLogId).toBeDefined()

            const resultPatchExerciseQuestion = await TestUtility.runApi(
              PatchUserV1ExerciseQuestion,
              "PATCH",
              "/api/user/v1/exercise/question",
              {
                Authorization: `Bearer ${token}`,
              },
              {
                answerLogSheetId,
                questionUserLogId: q.questionUserLogId,
                exerciseId,
                answer:
                  q.answerType === "SELECT"
                    ? {
                        type: "SELECT",
                        answerId: "1",
                      }
                    : {
                        type: "MULTI_SELECT",
                        answerIds: ["1", "2"],
                      },
              },
            )
            expect(resultPatchExerciseQuestion.ok).toBe(true)
            expect(resultPatchExerciseQuestion.status).toBe(200)
          },
        ),
      )
      const resultPostExerciseQuestion = await TestUtility.runApi(
        PostUserV1ExerciseQuestion,
        "POST",
        "/api/user/v1/exercise/question",
        {
          Authorization: `Bearer ${token}`,
        },
        {
          answerLogSheetId,
          exerciseId,
        },
      )
      expect(resultPostExerciseQuestion.ok).toBe(true)
      expect(resultPostExerciseQuestion.status).toBe(200)

      const result = await TestUtility.runApi(
        GET,
        "GET",
        `/api/user/v1/result/log-sheet?answerLogSheetId=${answerLogSheetId}`,
        {
          Authorization: `Bearer ${token}`,
        },
      )
      expect(result.ok).toBe(true)
      expect(result.status).toBe(200)
      const json = await result.json()
      expect(json.success).toBe(true)
      expect(json.data.answerLogSheetId).toEqual(answerLogSheetId)
      expect(json.data.detail).toBeDefined()
      expect(json.data.detail).toEqual(
        expect.objectContaining({
          isInProgress: false,
          totalQuestionCount: jsonGetExerciseQuestion.data.questions.length,
          totalCorrectCount: 0,
          totalIncorrectCount: jsonGetExerciseQuestion.data.questions.length,
          totalUnansweredCount: 0,
        }),
      )
      expect(json.data.detail.questionUserLogs).toBeDefined()
      expect(Array.isArray(json.data.detail.questionUserLogs)).toBe(true)
      expect(
        json.data.detail.questionUserLogs.every(
          (a: {
            answers: {
              selection: { answerId: string; selectContent: string }[]
            }
          }) => a.answers.selection.length === 4,
        ),
      ).toBe(true)
      expect(
        json.data.detail.questionUserLogs.every(
          (a: {
            answerType: string
            userAnswers: {
              answerId: string
              isCorrect: boolean
              isSelected: boolean
            }[]
          }) => a.userAnswers.length === 4,
        ),
      ).toBe(true)

      expect(json.data.exercise).toBeDefined()
      expect(json.data.exercise).toEqual({
        exerciseId: exerciseId,
        title: "プログラミング入門",
        description: "プログラミングの基礎を学ぶための問題集です。",
      })
      expect(json.data.createdAt).toBeIsoUtcString()
      expect(json.data.updatedAt).toBeIsoUtcString()
    })

    test("すべての正解を選択して回答履歴が取得できる", async () => {
      const token = await TestUtility.getGuestToken()
      const resultSignUp = await TestUtility.signUpByToken(token)
      expect(resultSignUp.ok).toBe(true)
      expect(resultSignUp.status).toBe(200)

      const exerciseId = "intro_programming_1"
      const resultGetExerciseQuestion = await TestUtility.runApi(
        GetUserV1ExerciseQuestion,
        "GET",
        `/api/user/v1/exercise/question?exerciseId=${exerciseId}&mode=answer`,
        {
          Authorization: `Bearer ${token}`,
        },
      )

      const jsonGetExerciseQuestion = await resultGetExerciseQuestion.json()
      expect(jsonGetExerciseQuestion.data.answerLogSheetId).toBeDefined()
      expect(jsonGetExerciseQuestion.data.answerLogSheetId).toEqual(
        expect.any(String),
      )
      expect(resultGetExerciseQuestion.ok).toBe(true)
      expect(resultGetExerciseQuestion.status).toBe(200)
      const answerLogSheetId = jsonGetExerciseQuestion.data.answerLogSheetId

      await Promise.all(
        jsonGetExerciseQuestion.data.questions.map(
          async (q: {
            questionUserLogId: string
            answerType: string
            questionId: string
          }) => {
            expect(q.questionUserLogId).toBeDefined()

            const answer = correctIntroProgramming1.find(
              ({ questionId }) => questionId === q.questionId,
            )!

            const resultPatchExerciseQuestion = await TestUtility.runApi(
              PatchUserV1ExerciseQuestion,
              "PATCH",
              "/api/user/v1/exercise/question",
              {
                Authorization: `Bearer ${token}`,
              },
              {
                answerLogSheetId,
                questionUserLogId: q.questionUserLogId,
                exerciseId,
                answer:
                  q.answerType === "SELECT"
                    ? {
                        type: "SELECT",
                        answerId: answer.answerIds[0],
                      }
                    : {
                        type: "MULTI_SELECT",
                        answerIds: answer.answerIds,
                      },
              },
            )
            expect(resultPatchExerciseQuestion.ok).toBe(true)
            expect(resultPatchExerciseQuestion.status).toBe(200)
          },
        ),
      )
      const resultPostExerciseQuestion = await TestUtility.runApi(
        PostUserV1ExerciseQuestion,
        "POST",
        "/api/user/v1/exercise/question",
        {
          Authorization: `Bearer ${token}`,
        },
        {
          answerLogSheetId,
          exerciseId,
        },
      )
      expect(resultPostExerciseQuestion.ok).toBe(true)
      expect(resultPostExerciseQuestion.status).toBe(200)

      const result = await TestUtility.runApi(
        GET,
        "GET",
        `/api/user/v1/result/log-sheet?answerLogSheetId=${answerLogSheetId}`,
        {
          Authorization: `Bearer ${token}`,
        },
      )
      expect(result.ok).toBe(true)
      expect(result.status).toBe(200)
      const json = await result.json()
      expect(json.success).toBe(true)
      expect(json.data.answerLogSheetId).toEqual(answerLogSheetId)
      expect(json.data.detail).toBeDefined()
      expect(json.data.detail).toEqual(
        expect.objectContaining({
          isInProgress: false,
          totalQuestionCount: jsonGetExerciseQuestion.data.questions.length,
          totalCorrectCount: jsonGetExerciseQuestion.data.questions.length,
          totalIncorrectCount: 0,
          totalUnansweredCount: 0,
        }),
      )
      expect(json.data.detail.questionUserLogs).toBeDefined()
      expect(Array.isArray(json.data.detail.questionUserLogs)).toBe(true)
      expect(
        json.data.detail.questionUserLogs.every(
          (a: {
            answers: {
              selection: { answerId: string; selectContent: string }[]
            }
          }) => a.answers.selection.length === 4,
        ),
      ).toBe(true)
      expect(
        json.data.detail.questionUserLogs.every(
          (a: {
            answerType: string
            userAnswers: {
              answerId: string
              isCorrect: boolean
              isSelected: boolean
            }[]
          }) => a.userAnswers.length === 4,
        ),
      ).toBe(true)

      // すべて正解を選んでいる
      expect(
        json.data.detail.questionUserLogs.every(
          (a: {
            answerType: string
            userAnswers: {
              answerId: string
              isCorrect: boolean
              isSelected: boolean
            }[]
          }) =>
            a.userAnswers.every((u) => {
              if (u.isCorrect) return u.isSelected
              return !u.isSelected
            }),
        ),
      ).toBe(true)

      expect(json.data.exercise).toBeDefined()
      expect(json.data.exercise).toEqual({
        exerciseId: exerciseId,
        title: "プログラミング入門",
        description: "プログラミングの基礎を学ぶための問題集です。",
      })
      expect(json.data.createdAt).toBeIsoUtcString()
      expect(json.data.updatedAt).toBeIsoUtcString()
    })
  })
})

const correctIntroProgramming1 = [
  {
    questionId: "intro_programming_1_1",
    answerIds: ["3"],
  },
  {
    questionId: "intro_programming_1_2",
    answerIds: ["1", "2", "3"],
  },
  {
    questionId: "intro_programming_1_3",
    answerIds: ["3"],
  },
  {
    questionId: "intro_programming_1_4",
    answerIds: ["1", "2", "3", "4"],
  },
  {
    questionId: "intro_programming_1_5",
    answerIds: ["3"],
  },
  {
    questionId: "intro_programming_1_6",
    answerIds: ["2"],
  },
  {
    questionId: "intro_programming_1_7",
    answerIds: ["1", "2", "3"],
  },
  {
    questionId: "intro_programming_1_8",
    answerIds: ["2"],
  },
  {
    questionId: "intro_programming_1_9",
    answerIds: ["1", "3", "4"],
  },
  {
    questionId: "intro_programming_1_10",
    answerIds: ["2"],
  },
]
