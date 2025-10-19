import { NextRequest } from "next/server"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { ExerciseService } from "@/lib/classes/services/ExerciseService"
import { prisma } from "@/lib/prisma"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { ApiV1InTypeMap, ApiV1ValidationResult } from "@/lib/types/apiV1Types"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用問題集の取得")

  return await api.execute("GetManageExercise", async () => {
    const { userService } = await api.checkAccessManagePage(request)

    const exerciseId = request.nextUrl.searchParams.get("exerciseId")
    if (!exerciseId || exerciseId.length < 2)
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "問題集ID" } },
      ])

    const exerciseService = new ExerciseService(prisma)
    exerciseService.setUserController(userService.userController)

    const exercise = await exerciseService.getExerciseById(exerciseId)

    return {
      exercise: {
        exerciseId: exercise.id,
        title: exercise.title,
        description: exercise.description,
        createdAt: exercise.createdAt.toISOString(),
        updatedAt: exercise.updatedAt.toISOString(),
        isPublished: exercise.isPublished,
        isCanSkip: exercise.isCanSkip,
        isScoringBatch: exercise.isScoringBatch,
        schoolId: exercise.schoolId,
        questionCount: exercise._count.exerciseQuestions,
      },
      questions: exercise.exerciseQuestions.map((q) => ({
        questionId: q.question.id,
        title: q.question.title,
        questionType: q.question.questionType,
        answerType: q.question.answerType,
        currentVersion: q.question.currentVersionId,
        draftVersion: q.question.draftVersionId,
        versions: q.question.versions.map((v) => v.version),
      })),
    }
  })
}

export async function POST(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用問題集の作成")

  return await api.execute("PostManageExercise", async () => {
    const { userService } = await api.checkAccessManagePage(request)

    const body = await request.json()

    const validationResult = validatePost(body)
    if (validationResult.error) throw validationResult.error

    const exerciseService = new ExerciseService(prisma)
    exerciseService.setUserController(userService.userController)

    const result = await exerciseService.createExercise(
      validationResult.result.schoolId,
      validationResult.result.property,
    )

    return {
      exercise: {
        exerciseId: result.id,
        title: result.title,
        description: result.description,
        createdAt: result.createdAt.toISOString(),
        updatedAt: result.updatedAt.toISOString(),
      },
    }
  })
}

export async function PATCH(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用問題集の更新")

  return api.execute("PatchManageExercise", async () => {
    const { userService } = await api.checkAccessManagePage(request)

    const exerciseId = request.nextUrl.searchParams.get("exerciseId")
    if (!exerciseId || exerciseId.length < 2)
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "問題集ID" } },
      ])

    const body = await request.json()
    const { error, result: resultBody } = validatePatch(body)

    if (error) throw error

    const exerciseService = new ExerciseService(prisma)
    exerciseService.setUserController(userService.userController)

    const result = await exerciseService.updateExercise(exerciseId, resultBody)

    return {
      exercise: {
        exerciseId: result.id,
        title: result.title,
        description: result.description,
        createdAt: result.createdAt.toISOString(),
        updatedAt: result.updatedAt.toISOString(),
      },
    }
  })
}

export function DELETE(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用問題集の削除")

  return api.execute("DeleteManageExercise", async () => {
    const { userService } = await api.checkAccessManagePage(request)

    const exerciseId = request.nextUrl.searchParams.get("exerciseId")
    if (!exerciseId || exerciseId.length < 2)
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "問題集ID" } },
      ])

    const exerciseService = new ExerciseService(prisma)
    exerciseService.setUserController(userService.userController)

    await exerciseService.deleteExercise(exerciseId)

    return {
      exerciseId,
    }
  })
}

// validation

function validatePost(
  body: unknown,
): ApiV1ValidationResult<
  ApiV1InTypeMap["PostManageExercise"],
  "RequiredValueError" | "NotFoundError" | "InvalidFormatError"
> {
  if (typeof body !== "object" || body === null)
    return {
      error: new ApiV1Error([{ key: "NotFoundError", params: null }]),
      result: null,
    }

  if (!("schoolId" in body) || !("property" in body)) {
    return {
      error: new ApiV1Error([{ key: "NotFoundError", params: null }]),
      result: null,
    }
  }

  if (typeof body.schoolId !== "string")
    return {
      error: new ApiV1Error([
        { key: "RequiredValueError", params: { key: "学校ID" } },
      ]),
      result: null,
    }
  if (typeof body.property !== "object" || body.property === null)
    return {
      error: new ApiV1Error([
        { key: "RequiredValueError", params: { key: "問題集のプロパティ" } },
      ]),
      result: null,
    }

  if (!("title" in body.property) || !("description" in body.property)) {
    return {
      error: new ApiV1Error([
        { key: "RequiredValueError", params: { key: "問題集のプロパティ" } },
      ]),
      result: null,
    }
  }

  const { title, description } = body.property

  if (typeof title !== "string" || typeof description !== "string")
    return {
      error: new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "問題集タイトル" } },
        { key: "InvalidFormatError", params: { key: "問題集説明" } },
      ]),
      result: null,
    }

  if (title.length < 1 || title.length > 200)
    return {
      error: new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "問題集タイトル" } },
      ]),
      result: null,
    }

  if (description.length > 2000)
    return {
      error: new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "問題集説明" } },
      ]),
      result: null,
    }

  return {
    error: null,
    result: body as ApiV1InTypeMap["PostManageExercise"],
  }
}

function validatePatch(
  body: unknown,
): ApiV1ValidationResult<
  ApiV1InTypeMap["PatchManageExercise"],
  "RequiredValueError" | "NotFoundError" | "InvalidFormatError"
> {
  if (typeof body !== "object" || body === null)
    return {
      error: new ApiV1Error([{ key: "NotFoundError", params: null }]),
      result: null,
    }

  if (!("title" in body || "description" in body || "isPublished" in body))
    return {
      error: new ApiV1Error([
        { key: "RequiredValueError", params: { key: "問題集のプロパティ" } },
      ]),
      result: null,
    }

  if ("title" in body) {
    if (typeof body.title !== "string")
      return {
        error: new ApiV1Error([
          { key: "RequiredValueError", params: { key: "問題集タイトル" } },
        ]),
        result: null,
      }

    if (body.title.length < 1 || body.title.length > 200)
      return {
        error: new ApiV1Error([
          { key: "RequiredValueError", params: { key: "問題集タイトル" } },
        ]),
        result: null,
      }
  }

  if ("description" in body) {
    if (typeof body.description !== "string")
      return {
        error: new ApiV1Error([
          { key: "RequiredValueError", params: { key: "問題集説明" } },
        ]),
        result: null,
      }

    if (body.description.length > 2000)
      return {
        error: new ApiV1Error([
          { key: "RequiredValueError", params: { key: "問題集説明" } },
        ]),
        result: null,
      }
  }

  if ("isPublished" in body) {
    if (typeof body.isPublished !== "boolean")
      return {
        error: new ApiV1Error([
          { key: "InvalidFormatError", params: { key: "公開状態" } },
        ]),
        result: null,
      }
  }

  return {
    error: null,
    result: body as ApiV1InTypeMap["PatchManageExercise"],
  }
}
