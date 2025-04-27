import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { ManageQuestionService } from "@/lib/classes/services/ManageQuestionService"
import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"

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
