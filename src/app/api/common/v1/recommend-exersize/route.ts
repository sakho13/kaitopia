import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { ExerciseService } from "@/lib/classes/services/ExerciseService"
import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"

export function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("おすすめ問題集取得")
  // ユーザ個別に10この問題集を取得するAPI

  return api.execute("GetRecommendExercise", async () => {
    await api.authorize(request)

    const exerciseService = ExerciseService.getInstance(prisma)

    const recommendExercises = await exerciseService.getRecommendExercises()

    return {
      recommendExercises: recommendExercises.map((exercise) => ({
        id: exercise.id,
        title: exercise.title,
        description: exercise.description,
      })),
    }
  })
}
