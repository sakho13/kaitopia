import { NextRequest } from "next/server"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { ManageQuestionService } from "@/lib/classes/services/ManageQuestionService"
import { validateBodyWrapper } from "@/lib/functions/validateBodyWrapper"
import { prisma } from "@/lib/prisma"
import {
  QuestionAnswerType,
  QuestionType,
} from "@/lib/types/base/questionTypes"
import { UserService } from "@/lib/classes/services/UserService"
import { ExerciseService } from "@/lib/classes/services/ExerciseService"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用問題集の問題取得")

  return await api.execute("GetManageExerciseQuestion", async () => {
    const { userService } = await api.checkAccessManagePage(request)

    const exerciseId = request.nextUrl.searchParams.get("exerciseId")
    const questionId = request.nextUrl.searchParams.get("questionId")

    if (!exerciseId || exerciseId.length < 2)
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "問題集ID" } },
      ])

    if (!questionId || questionId.length < 2)
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "問題ID" } },
      ])

    const manageQuestionService = new ManageQuestionService(
      userService.userController,
      prisma,
    )

    manageQuestionService.exerciseId = exerciseId

    const question = await manageQuestionService.getQuestionDetail(questionId)
    if (!question)
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    return {
      title: question.title,
      questionType: question.questionType,
      answerType: question.answerType,
      isPublished: question.isPublished,

      createdAt: question.createdAt.toISOString(),
      updatedAt: question.updatedAt.toISOString(),
      deletedAt: question.deletedAt?.toISOString() ?? null,

      versions: question.versions.map((v) => ({
        version: v.version,
        content: v.content,
        hint: v.hint,
      })),
    }
  })
}

export async function POST(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用問題集の問題登録")

  return await api.execute("PostManageExerciseQuestion", async () => {
    await api.checkAccessManagePage(request)

    const body = await request.json()
    const validateResult = validatePost(body)
    if (validateResult.error) throw validateResult.error

    const userService = new UserService(prisma)
    await userService.getUserInfo(api.getFirebaseUid())

    const exerciseService = new ExerciseService(prisma)
    exerciseService.setUserController(userService.userController)
    const exercise = await exerciseService.getExerciseById(
      validateResult.result.exerciseId,
    )

    const manageQuestionService = new ManageQuestionService(
      userService.userController,
      prisma,
    )
    manageQuestionService.exerciseId = exercise.id
    const question = await manageQuestionService.createQuestionWithExercise(
      exercise.schoolId,
      {
        title: validateResult.result.title,
        questionType: validateResult.result.questionType,
        answerType: validateResult.result.answerType,
      },
    )

    return {
      questionId: question.id,
    }
  })
}

function validatePost(rawBody: unknown) {
  return validateBodyWrapper("PostManageExerciseQuestion", rawBody, (b) => {
    if (typeof b !== "object" || b === null) {
      throw new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "リクエストボディ" } },
      ])
    }

    // 必須項目のチェック
    if (!("exerciseId" in b) || typeof b.exerciseId !== "string") {
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "問題集ID" } },
      ])
    }
    if (!("title" in b) || typeof b.title !== "string") {
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "問題タイトル" } },
      ])
    }
    if (!("questionType" in b) || typeof b.questionType !== "string") {
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "問題タイプ" } },
      ])
    }
    if (!("answerType" in b) || typeof b.answerType !== "string") {
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "回答タイプ" } },
      ])
    }

    if (!Object.keys(QuestionType).includes(b.questionType)) {
      throw new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "問題タイプ" } },
      ])
    }
    if (!Object.keys(QuestionAnswerType).includes(b.answerType)) {
      throw new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "回答タイプ" } },
      ])
    }

    if (b.exerciseId.length < 2) {
      throw new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "問題集ID" } },
      ])
    }
    if (b.title.length < 1 || b.title.length > 64) {
      throw new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "問題タイトル" } },
      ])
    }

    return
  })
}
