import { NextRequest } from "next/server"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { ExerciseService } from "@/lib/classes/services/ExerciseService"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用問題集の取得")

  return await api.execute("GetManageExercises", async () => {
    const { userService } = await api.checkAccessManagePage(request)

    const schoolId = request.nextUrl.searchParams.get("schoolId") ?? undefined
    if (!schoolId)
      return {
        exercises: [],
        nextPage: null,
        totalCount: 0,
      }

    const page = parseInt(request.nextUrl.searchParams.get("page") || "1") ?? 1

    const count = parseInt(
      request.nextUrl.searchParams.get("count") ?? "10",
      10,
    )

    const exerciseService = new ExerciseService(prisma)
    exerciseService.setUserController(userService.userController)
    const { exercises, totalCount, nextPage } =
      await exerciseService.getExercisesForManage(schoolId, count, page)

    return {
      exercises: exercises.map((exercise) => ({
        exerciseId: exercise.exerciseId,

        title: exercise.title,
        description: exercise.description,

        updatedAt: exercise.updatedAt.toISOString(),
        createdAt: exercise.createdAt.toISOString(),

        schoolId: exercise.schoolId,
        isCanSkip: exercise.isCanSkip,
        isScoringBatch: exercise.isScoringBatch,
        questionCount: exercise.questionCount,
      })),
      nextPage,
      totalCount,
    }
  })
}
