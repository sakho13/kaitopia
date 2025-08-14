import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { UserService2 } from "@/lib/classes/services/UserService2"
import { UserExerciseService } from "@/lib/classes/services/UserExerciseService"
import { PrismaUserRepository } from "@/lib/classes/repositories/PrismaUserRepository"
import { PrismaSchoolRepository } from "@/lib/classes/repositories/PrismaSchoolRepository"
import { UserController } from "@/lib/classes/controller/UserController"
import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("問題集の取得")

  return await api.execute("GetUserExerciseInfo", async () => {
    const { uid } = await api.authorize(request)

    const exerciseId = request.nextUrl.searchParams.get("exerciseId")
    if (!exerciseId || exerciseId.length === 0)
      throw new ApiV1Error([
        {
          key: "NotFoundError",
          params: null,
        },
      ])

    const userService = new UserService2(
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

    // UserControllerを初期化してユーザー情報を設定
    const userController = new UserController(prisma)
    await userController.getUserInfo(uid)

    const userExerciseService = new UserExerciseService(prisma, userController)
    const exercise = await userExerciseService.getExerciseInfo(user, exerciseId)

    return {
      exercise: {
        title: exercise.title,
        description: exercise.description,
        isPublished: exercise.isPublished,
        isCanSkip: exercise.isCanSkip,
        isScoringBatch: exercise.isScoringBatch,
      },
      questions: exercise.exerciseQuestions.map((q) => ({
        title: q.question.title,
        questionType: q.question.questionType,
        answerType: q.question.answerType,
      })),
    }
  })
}
