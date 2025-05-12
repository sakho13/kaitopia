import { NextRequest } from "next/server"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { UserService } from "@/lib/classes/services/UserService"
import { prisma } from "@/lib/prisma"
import { UserQuestionService } from "@/lib/classes/services/UserQuestionService"

export function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("ユーザの回答ログ取得")

  return api.execute("GetUserResultLog", async () => {
    await api.authorize(request)

    const page = parseInt(request.nextUrl.searchParams.get("page") || "1") ?? 1

    const count = parseInt(
      request.nextUrl.searchParams.get("count") ?? "10",
      10,
    )

    const userService = new UserService(prisma)
    await userService.getUserInfo(api.getFirebaseUid())

    const userQuestionService = new UserQuestionService(
      userService.userController,
      prisma,
    )
    const { answerLogSheets, nextPage, totalCount } =
      await userQuestionService.getAnswerLogSheets(count, page)

    return {
      resultLogs: answerLogSheets.map((log) => ({
        answerLogSheetId: log.answerLogSheetId,
        exercise: log.exercise
          ? {
              exerciseId: log.exercise.id,
              title: log.exercise.title,
            }
          : null,
        isInProgress: log.isInProgress,
        totalQuestionCount: log._count.questionUserLogs,
        totalCorrectCount: log.totalCorrectCount,
        totalIncorrectCount: log.totalIncorrectCount,
        totalUnansweredCount: log.totalUnansweredCount,
        createdAt: log.createdAt.toISOString(),
      })),
      nextPage,
      totalCount,
    }
  })
}
