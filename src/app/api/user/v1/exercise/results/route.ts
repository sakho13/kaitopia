import { NextRequest } from "next/server"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { UserService } from "@/lib/classes/services/UserService"
import { UserResultService } from "@/lib/classes/services/UserResultService"
import { PrismaUserLogRepository } from "@/lib/classes/repositories/PrismaUserLogRepository"
import { PrismaUserRepository } from "@/lib/classes/repositories/PrismaUserRepository"
import { PrismaSchoolRepository } from "@/lib/classes/repositories/PrismaSchoolRepository"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("問題集結果の取得")

  return await api.execute("GetUserExerciseResults", async () => {
    const { uid } = await api.authorize(request)

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

    const { answerLogSheets, totalCount, nextPage } =
      await userResultService.getExerciseResults(
        user,
        count,
        page,
        ignoreInProgress === "true",
      )

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
        totalQuestionCount: r.totalQuestionCount,
      })),
      nextPage,
      totalCount,
    }
  })
}
