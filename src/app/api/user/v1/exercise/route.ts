import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { UserService } from "@/lib/classes/services/UserService"
import { UserExerciseService } from "@/lib/classes/services/UserExerciseService"

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

    const userService = UserService.createByPrisma(prisma)

    const user = await userService.getUserInfo(uid)
    if (!user)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])

    if (user.isDeleted) {
      throw new ApiV1Error([{ key: "DeletedUserError", params: null }])
    }

    const userExerciseService = new UserExerciseService(prisma)
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
