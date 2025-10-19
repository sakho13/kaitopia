import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { ExerciseService } from "@/lib/classes/services/ExerciseService"
import { UserService } from "@/lib/classes/services/UserService"
import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"

export function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("問題集の取得")

  return api.execute("GetUserExerciseInfo", async () => {
    await api.authorize(request)

    const exerciseId = request.nextUrl.searchParams.get("exerciseId")
    if (!exerciseId || exerciseId.length === 0)
      throw new ApiV1Error([
        {
          key: "NotFoundError",
          params: null,
        },
      ])

    const userService = new UserService(prisma)
    await userService.getUserInfo(api.getFirebaseUid())
    const exerciseService = new ExerciseService(prisma)
    exerciseService.setUserController(userService.userController)

    const exercise = await exerciseService.getExerciseById(exerciseId)

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
