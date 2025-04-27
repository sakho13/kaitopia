import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { ExerciseService } from "@/lib/classes/services/ExerciseService"
import { UserQuestionService } from "@/lib/classes/services/UserQuestionService"
import { UserService } from "@/lib/classes/services/UserService"
import { prisma } from "@/lib/prisma"
import { ApiV1InTypeMap, ApiV1ValidationResult } from "@/lib/types/apiV1Types"
import { NextRequest } from "next/server"

export function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("問題集の取得")

  return api.execute("GetUserExerciseQuestion", async () => {
    await api.authorize(request)

    const exerciseId = request.nextUrl.searchParams.get("exerciseId")
    if (!exerciseId || exerciseId.length === 0)
      throw new ApiV1Error([
        {
          key: "NotFoundError",
          params: null,
        },
      ])

    const mode = request.nextUrl.searchParams.get("mode")
    if (!mode || mode.length === 0)
      throw new ApiV1Error([
        {
          key: "NotFoundError",
          params: null,
        },
      ])
    if (mode !== "show" && mode !== "answer")
      throw new ApiV1Error([
        {
          key: "NotFoundError",
          params: null,
        },
      ])

    const userService = new UserService(prisma)
    await userService.getUserInfo(api.getFirebaseUid())

    const userQuestionService = new UserQuestionService(
      userService.userController,
      prisma,
    )
    userQuestionService.exerciseId = exerciseId

    const { questions, answerLogSheetId } =
      await userQuestionService.getQuestions(mode)

    const exerciseService = new ExerciseService(prisma)
    exerciseService.setUserController(userService.userController)

    const exercise = await exerciseService.getExerciseById(exerciseId)

    // ユーザへ次に行うべきことを通知するためのモード
    const fn = mode === "show" ? null : mode === "answer" ? "answer" : null

    return {
      fn,
      answerLogSheetId,
      exercise: {
        title: exercise.title,
        description: exercise.description,
        isPublished: exercise.isPublished,
        isCanSkip: exercise.isCanSkip,
        isScoringBatch: exercise.isScoringBatch,
      },
      questions: questions,
    }
  })
}

/**
 * 一括採点or結果を取得したい場合に実行される
 */
export function POST(request: NextRequest) {
  const api = new ApiV1Wrapper("問題集として採点")

  return api.execute("PostUserExerciseQuestion", async () => {
    await api.authorize(request)

    const { error, result } = validatePost(await request.json())
    if (error) throw error

    //

    return {
      fn: null,
      answerLogSheetId: result.answerLogSheetId,
      exerciseId: result.exerciseId,
      result: {
        isInProgress: true,
        totalCorrectCount: 0,
        totalIncorrectCount: 0,
        totalUnansweredCount: 0,
      },
    }
  })
}

/**
 * 問題ごとに実行される
 */
export function PATCH(request: NextRequest) {
  const api = new ApiV1Wrapper("問題集の回答")

  return api.execute("PatchUserExerciseQuestion", async () => {
    await api.authorize(request)

    const { error, result } = validatePatch(await api.authorize(request))
    if (error) throw error

    //

    return {
      fn: null,
      answerLogSheetId: result.answerLogSheetId,
      exerciseId: result.exerciseId,
      result: {
        isInProgress: true,
        totalCorrectCount: 0,
        totalIncorrectCount: 0,
        totalUnansweredCount: 0,
      },
    }
  })
}

// validation

function validatePost(
  body: unknown,
): ApiV1ValidationResult<
  ApiV1InTypeMap["PostUserExerciseQuestion"],
  "RequiredValueError" | "NotFoundError" | "InvalidFormatError"
> {
  if (typeof body !== "object" || body === null)
    return {
      error: new ApiV1Error([{ key: "NotFoundError", params: null }]),
      result: null,
    }

  if (!("answerLogSheetId" in body) || !("exerciseId" in body)) {
    return {
      error: new ApiV1Error([
        { key: "RequiredValueError", params: { key: "問題集のプロパティ" } },
      ]),
      result: null,
    }
  }

  const { answerLogSheetId, exerciseId } = body

  if (typeof answerLogSheetId !== "string" || typeof exerciseId !== "string")
    return {
      error: new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "ログシートID" } },
        { key: "InvalidFormatError", params: { key: "問題集ID" } },
      ]),
      result: null,
    }

  if (answerLogSheetId.length < 1)
    return {
      error: new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "ログシートID" } },
      ]),
      result: null,
    }

  if (exerciseId.length < 1)
    return {
      error: new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "問題集ID" } },
      ]),
      result: null,
    }

  return {
    error: null,
    result: body as ApiV1InTypeMap["PostUserExerciseQuestion"],
  }
}

function validatePatch(
  body: unknown,
): ApiV1ValidationResult<
  ApiV1InTypeMap["PatchUserExerciseQuestion"],
  "RequiredValueError" | "NotFoundError" | "InvalidFormatError"
> {
  if (typeof body !== "object" || body === null)
    return {
      error: new ApiV1Error([{ key: "NotFoundError", params: null }]),
      result: null,
    }

  if (!("answerLogSheetId" in body) || !("exerciseId" in body)) {
    return {
      error: new ApiV1Error([
        { key: "RequiredValueError", params: { key: "問題集のプロパティ" } },
      ]),
      result: null,
    }
  }

  const { answerLogSheetId, exerciseId } = body

  if (typeof answerLogSheetId !== "string" || typeof exerciseId !== "string")
    return {
      error: new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "ログシートID" } },
        { key: "InvalidFormatError", params: { key: "問題集ID" } },
      ]),
      result: null,
    }

  if (answerLogSheetId.length < 1)
    return {
      error: new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "ログシートID" } },
      ]),
      result: null,
    }

  if (exerciseId.length < 1)
    return {
      error: new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "問題集ID" } },
      ]),
      result: null,
    }

  // 回答情報チェック

  if (!("questionId" in body) || typeof body.questionId !== "string")
    return {
      error: new ApiV1Error([
        { key: "RequiredValueError", params: { key: "問題ID" } },
      ]),
      result: null,
    }

  if (!("version" in body) || typeof body.version !== "number")
    return {
      error: new ApiV1Error([
        { key: "RequiredValueError", params: { key: "バージョン" } },
      ]),
      result: null,
    }

  if (!("answer" in body) || typeof body.answer !== "object")
    return {
      error: new ApiV1Error([
        { key: "RequiredValueError", params: { key: "回答" } },
      ]),
      result: null,
    }

  // 回答の型チェック
  const answer = body.answer
  if (!answer || !("type" in answer) || typeof answer.type !== "string")
    return {
      error: new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "回答形式" } },
      ]),
      result: null,
    }
  if (!["SKIP", "SELECT", "MULTI_SELECT", "TEXT"].includes(answer.type))
    return {
      error: new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "回答形式" } },
      ]),
      result: null,
    }
  if (answer.type === "SELECT") {
    if (!("answerId" in answer) || typeof answer.answerId !== "string")
      return {
        error: new ApiV1Error([
          { key: "RequiredValueError", params: { key: "選択肢ID" } },
        ]),
        result: null,
      }
  }
  if (answer.type === "MULTI_SELECT") {
    if (
      !("answerIds" in answer) ||
      !Array.isArray(answer.answerIds) ||
      !answer.answerIds.every((id) => typeof id === "string")
    )
      return {
        error: new ApiV1Error([
          { key: "RequiredValueError", params: { key: "選択肢ID" } },
        ]),
        result: null,
      }
  }
  if (answer.type === "TEXT") {
    if (
      !("content" in answer) ||
      typeof answer.content !== "string" ||
      answer.content.length < 1
    )
      return {
        error: new ApiV1Error([
          { key: "RequiredValueError", params: { key: "回答内容" } },
        ]),
        result: null,
      }
  }

  return {
    error: null,
    result: body as ApiV1InTypeMap["PatchUserExerciseQuestion"],
  }
}
