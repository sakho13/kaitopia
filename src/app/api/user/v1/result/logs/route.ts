import { NextRequest } from "next/server"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { UserService } from "@/lib/classes/services/UserService"
import { UserResultService } from "@/lib/classes/services/UserResultService"
import { PrismaUserLogRepository } from "@/lib/classes/repositories/PrismaUserLogRepository"
import { PrismaUserRepository } from "@/lib/classes/repositories/PrismaUserRepository"
import { PrismaSchoolRepository } from "@/lib/classes/repositories/PrismaSchoolRepository"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("ユーザの回答ログ取得")

  return await api.execute("GetUserResultLog", async () => {
    const { uid } = await api.authorize(request)

    const page = parseInt(request.nextUrl.searchParams.get("page") || "1") ?? 1
    const count = parseInt(
      request.nextUrl.searchParams.get("count") ?? "10",
      10,
    )

    const userService = new UserService(
      prisma,
      new PrismaUserRepository(prisma),
      new PrismaSchoolRepository(prisma),
    )

    const user = await userService.getUserInfo(uid)
    if (!user)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])

    if (user.isDeleted) {
      throw new ApiV1Error([{ key: "DeletedUserError", params: null }])
    }

    const userResultService = new UserResultService(
      new PrismaUserLogRepository(prisma),
    )

    const { resultLogs, nextPage, totalCount } =
      await userResultService.getAnswerLogs(user, count, page)

    return {
      resultLogs: resultLogs.map((log) => ({
        answerLogSheetId: log.answerLogSheetId,
        exercise: log.exercise
          ? {
              exerciseId: log.exercise.id,
              title: log.exercise.title,
            }
          : null,
        isInProgress: log.isInProgress,
        totalQuestionCount: log.totalQuestionCount,
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
