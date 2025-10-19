import { NextRequest } from "next/server"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { UserQuestionService } from "@/lib/classes/services/UserQuestionService"
import { UserService } from "@/lib/classes/services/UserService"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("問題回答シート取得")

  return await api.execute("GetUserResultLogSheet", async () => {
    await api.authorize(request)

    const answerLogSheetId =
      request.nextUrl.searchParams.get("answerLogSheetId")

    if (!answerLogSheetId)
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    const userService = new UserService(prisma)
    await userService.getUserInfo(api.getFirebaseUid())

    const userQuestionService = new UserQuestionService(
      userService.userController,
      prisma,
    )

    const sheet = await userQuestionService.getAnswerLogSheet(answerLogSheetId)

    return {
      answerLogSheetId,
      detail: {
        isInProgress: sheet.isInProgress,
        totalQuestionCount: sheet.totalQuestionCount,
        totalCorrectCount: sheet.totalCorrectCount,
        totalIncorrectCount: sheet.totalIncorrectCount,
        totalUnansweredCount: sheet.totalUnansweredCount,
        questionUserLogs: sheet.questionAnswerProperties,
      },
      exercise: sheet.exercise
        ? {
            exerciseId: sheet.exercise.id,
            title: sheet.exercise.title,
            description: sheet.exercise.description,
          }
        : null,

      createdAt: sheet.createdAt.toISOString(),
      updatedAt: sheet.updatedAt.toISOString(),
    }
  })
}
