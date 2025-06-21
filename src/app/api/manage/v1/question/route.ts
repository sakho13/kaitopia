import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { validateBodyWrapper } from "@/lib/functions/validateBodyWrapper"
import { PrismaQuestionRepository } from "@/lib/classes/repositories/PrismaQuestionRepository"
import { ManageQuestionService2 } from "@/lib/classes/services/ManageQuestionService2"
import { ManageQuestionService } from "@/lib/classes/services/ManageQuestionService"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用問題の取得")

  return await api.execute("GetManageQuestion", async () => {
    const { userService } = await api.checkAccessManagePage(request)

    const questionId = request.nextUrl.searchParams.get("questionId")
    if (!questionId || questionId.length < 2)
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "問題ID" } },
      ])

    await userService.getUserInfo(api.getFirebaseUid())
    const userController = userService.userController

    const questionService = new ManageQuestionService(userController, prisma)
    const question = await questionService.getQuestionDetail(questionId)

    return {
      question: {
        schoolId: question.schoolId,
        questionId,
        title: question.title,
        questionType: question.questionType,
        answerType: question.answerType,
      },
      currentVersion: question.currentVersionId,
      draftVersion: question.draftVersionId,
      versions: question.versions.map((v) => {
        const base = {
          questionId,
          version: v.version,
          content: v.content,
          hint: v.hint,
        }
        if (question.answerType === "TEXT") {
          return {
            ...base,
            property: {
              answerId: v.questionAnswers[0]?.answerId || "",
              maxLength: v.questionAnswers[0]?.maxLength || 0,
              minLength: v.questionAnswers[0]?.minLength || 0,
            },
          }
        }

        return {
          ...base,
          selection: v.questionAnswers.map((a) => ({
            answerId: a.answerId,
            isCorrect: a.isCorrect!,
            selectContent: a.selectContent!,
          })),
        }
      }),
    }
  })
}

export async function PATCH(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用問題の更新")

  return api.execute("PatchManageQuestion", async () => {
    const { userService } = await api.checkAccessManagePage(request)

    const questionId = request.nextUrl.searchParams.get("questionId")
    if (!questionId)
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "問題ID" } },
      ])

    const body = await request.json()
    const { error, result } = validatePatch(body)
    if (error) throw error

    const user = await userService.getUserInfo(api.getFirebaseUid())
    if (!user) throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    const questionRepository = new PrismaQuestionRepository(prisma)
    const service = new ManageQuestionService2(questionRepository)

    const question = await service.getQuestion(questionId)
    if (!question) throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    const access = await userService.userController.accessSchoolMethod(
      question.value.schoolId,
    )
    if (!access.includes("edit")) {
      throw new ApiV1Error([{ key: "RoleTypeError", params: null }])
    }

    await service.editQuestion(question, { title: result.title! })
    return { success: true, questionId }
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
