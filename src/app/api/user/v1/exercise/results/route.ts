import { NextRequest } from "next/server"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { UserQuestionService } from "@/lib/classes/services/UserQuestionService"
import { UserService } from "@/lib/classes/services/UserService"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("問題集結果の取得")

  return await api.execute("GetUserExerciseResults", async () => {
    await api.authorize(request)

    const ignoreInProgress =
      request.nextUrl.searchParams.get("ignoreInProgress") || "false"
    if (ignoreInProgress !== "true" && ignoreInProgress !== "false")
      throw new ApiV1Error([
        {
          key: "NotFoundError",
          params: null,
        },
      ])

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
    const { answerLogSheets, totalCount, nextPage } =
      await userQuestionService.getAnswerLogSheets(count, page)

    return {
      answerLogSheets: answerLogSheets.map((r) => ({
        answerLogSheetId: r.answerLogSheetId,
        exerciseId: r.exerciseId!,
        isInProgress: r.isInProgress,
        totalCorrectCount: r.totalCorrectCount,
        totalIncorrectCount: r.totalIncorrectCount,
        totalUnansweredCount: r.totalUnansweredCount,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        totalQuestionCount: r._count.questionUserLogs,
      })),
      nextPage,
      totalCount,
    }
  })
}
