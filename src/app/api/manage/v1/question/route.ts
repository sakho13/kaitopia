import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { validateBodyWrapper } from "@/lib/functions/validateBodyWrapper"
import { PrismaQuestionRepository } from "@/lib/classes/repositories/PrismaQuestionRepository"
import { ManageQuestionService2 } from "@/lib/classes/services/ManageQuestionService2"
import { ManageQuestionGroupService } from "@/lib/classes/services/ManageQuestionGroupService"
import { UserService2 } from "@/lib/classes/services/UserService2"
import { PrismaUserRepository } from "@/lib/classes/repositories/PrismaUserRepository"
import { PrismaSchoolRepository } from "@/lib/classes/repositories/PrismaSchoolRepository"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用問題の取得")

  return await api.execute("GetManageQuestion", async () => {
    await api.checkAccessManagePage(request)

    const questionId = request.nextUrl.searchParams.get("questionId")
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

    const questionService = new ManageQuestionService2(
      prisma,
      new PrismaQuestionRepository(prisma),
    )
    const question = await questionService.getQuestion(user, questionId)
    if (!question)
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    return {
      question: {
        schoolId: question.value.schoolId,
        questionId,
        title: question.value.title,
        questionType: question.value.questionType,
        answerType: question.value.answerType,
      },
      currentVersion: question.value.currentVersion,
      draftVersion: question.value.draftVersion,
      versions: question.value.versions.map((v) => {
        const base = {
          questionId,
          version: v.value.version,
          content: v.value.content,
          hint: v.value.hint,
        }

        return {
          ...base,
          ...v.propertyOfAnswer,
        }
      }),
    }
  })
}

export async function PATCH(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用問題の更新")

  return api.execute("PatchManageQuestion", async () => {
    await api.checkAccessManagePage(request)

    const questionId = request.nextUrl.searchParams.get("questionId")
    if (!questionId)
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "問題ID" } },
      ])

    const body = await request.json()
    const { error, result } = validatePatch(body)
    if (error) throw error

    const userService2 = new UserService2(
      prisma,
      new PrismaUserRepository(prisma),
      new PrismaSchoolRepository(prisma),
    )
    const user = await userService2.getUserInfo(api.getFirebaseUid())
    if (!user) throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    const questionRepository = new PrismaQuestionRepository(prisma)
    const service = new ManageQuestionService2(prisma, questionRepository)

    const question = await service.getQuestion(user, questionId)
    if (!question)
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    await service.editQuestion(user, question, { title: result.title! })

    if ("questionGroupIds" in result) {
      const groupService = new ManageQuestionGroupService(prisma)
      await groupService.setQuestionGroups(
        user,
        questionId,
        question.value.schoolId,
        result.questionGroupIds ?? [],
      )
    }
    return { questionId }
  })
}

function validatePatch(body: unknown) {
  return validateBodyWrapper("PatchManageQuestion", body, (b) => {
    if (typeof b !== "object" || b === null) {
      throw new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "リクエストボディ" } },
      ])
    }

    if (!("title" in b)) {
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "問題タイトル" } },
      ])
    }

    if ("questionGroupIds" in b) {
      if (!Array.isArray(b.questionGroupIds)) {
        throw new ApiV1Error([
          { key: "InvalidFormatError", params: { key: "問題グループID" } },
        ])
      }
      for (const id of b.questionGroupIds) {
        if (typeof id !== "string") {
          throw new ApiV1Error([
            { key: "InvalidFormatError", params: { key: "問題グループID" } },
          ])
        }
      }
    }

    if (
      typeof b.title !== "string" ||
      b.title.length < 1 ||
      b.title.length > 64
    ) {
      throw new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "問題タイトル" } },
      ])
    }
  })
}
