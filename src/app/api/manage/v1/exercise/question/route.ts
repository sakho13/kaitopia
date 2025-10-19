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
import { UserService2 } from "@/lib/classes/services/UserService2"
import { PrismaUserRepository } from "@/lib/classes/repositories/PrismaUserRepository"
import { PrismaSchoolRepository } from "@/lib/classes/repositories/PrismaSchoolRepository"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用問題集の問題取得")

  return await api.execute("GetManageExerciseQuestion", async () => {
    await api.checkAccessManagePage(request)

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

    const userService2 = new UserService2(
      prisma,
      new PrismaUserRepository(prisma),
      new PrismaSchoolRepository(prisma),
    )
    const user = await userService2.getUserInfo(api.getFirebaseUid())
    if (!user)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])

    const manageQuestionService = new ManageQuestionService(prisma)

    manageQuestionService.exerciseId = exerciseId

    const question = await manageQuestionService.getQuestionDetail(
      user,
      questionId,
    )
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

    const userService2 = new UserService2(
      prisma,
      new PrismaUserRepository(prisma),
      new PrismaSchoolRepository(prisma),
    )
    const user = await userService2.getUserInfo(api.getFirebaseUid())
    if (!user)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])

    const exerciseService = new ExerciseService(prisma)
    exerciseService.setUserController(userService.userController)
    const exercise = await exerciseService.getExerciseById(
      validateResult.result.exerciseId,
    )

    const manageQuestionService = new ManageQuestionService(prisma)
    manageQuestionService.exerciseId = exercise.id
    const question = await manageQuestionService.createQuestionWithExercise(
      user,
      exercise.schoolId,
      {
        title: validateResult.result.title,
        questionType: validateResult.result.questionType,
        answerType: validateResult.result.answerType,
        questionProperty: validateResult.result.questionProperty,
        questionAnswerProperty: validateResult.result.questionAnswerProperty,
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

    // オプション項目のチェック
    if (
      !("questionProperty" in b) ||
      typeof b.questionProperty !== "object" ||
      b.questionProperty === null
    ) {
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "問題プロパティ" } },
      ])
    }
    if (
      !("questionAnswerProperty" in b) ||
      typeof b.questionAnswerProperty !== "object" ||
      b.questionAnswerProperty === null
    ) {
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "回答プロパティ" } },
      ])
    }
    const { questionProperty, questionAnswerProperty } = b

    if (!("content" in questionProperty)) {
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "問題内容" } },
      ])
    }
    if (!("hint" in questionProperty)) {
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "ヒント" } },
      ])
    }

    if (
      typeof questionProperty.content !== "string" ||
      questionProperty.content.length < 1 ||
      questionProperty.content.length > 1024
    ) {
      throw new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "問題内容" } },
      ])
    }
    if (
      typeof questionProperty.hint !== "string" ||
      questionProperty.hint.length > 1024
    ) {
      throw new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "ヒント" } },
      ])
    }

    if (b.answerType === "SELECT") {
      if (!("selection" in questionAnswerProperty)) {
        throw new ApiV1Error([
          { key: "RequiredValueError", params: { key: "選択肢" } },
        ])
      }
    }

    if (b.answerType === "MULTI_SELECT") {
      if (!("selection" in questionAnswerProperty)) {
        throw new ApiV1Error([
          { key: "RequiredValueError", params: { key: "選択肢" } },
        ])
      }
    }

    if (b.answerType === "TEXT") {
      if (
        !("property" in questionAnswerProperty) ||
        typeof questionAnswerProperty.property !== "object" ||
        questionAnswerProperty.property === null
      ) {
        throw new ApiV1Error([
          { key: "RequiredValueError", params: { key: "回答プロパティ" } },
        ])
      }

      if (
        !("minLength" in questionAnswerProperty.property) ||
        typeof questionAnswerProperty.property.minLength !== "number"
      ) {
        throw new ApiV1Error([
          { key: "RequiredValueError", params: { key: "最小文字数" } },
        ])
      }
      if (
        !("maxLength" in questionAnswerProperty.property) ||
        typeof questionAnswerProperty.property.maxLength !== "number"
      ) {
        throw new ApiV1Error([
          { key: "RequiredValueError", params: { key: "最大文字数" } },
        ])
      }

      if (
        questionAnswerProperty.property.minLength < 1 ||
        questionAnswerProperty.property.minLength > 1000
      ) {
        throw new ApiV1Error([
          { key: "InvalidFormatError", params: { key: "最小文字数" } },
        ])
      }
      if (
        questionAnswerProperty.property.maxLength < 1 ||
        questionAnswerProperty.property.maxLength > 10000
      ) {
        throw new ApiV1Error([
          { key: "InvalidFormatError", params: { key: "最大文字数" } },
        ])
      }
      if (
        questionAnswerProperty.property.minLength >
        questionAnswerProperty.property.maxLength
      ) {
        throw new ApiV1Error([
          { key: "InvalidFormatError", params: { key: "文字数範囲" } },
        ])
      }
    }

    return
  })
}
