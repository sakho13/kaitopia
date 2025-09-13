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
  const api = new ApiV1Wrapper("問題回答シート取得")

  return await api.execute("GetUserResultLogSheet", async () => {
    const { uid } = await api.authorize(request)

    const answerLogSheetId =
      request.nextUrl.searchParams.get("answerLogSheetId")

    if (!answerLogSheetId)
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])

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

    const sheet = await userResultService.getAnswerLogSheetDetail(
      user,
      answerLogSheetId,
    )

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
