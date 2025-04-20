import { NextRequest } from "next/server"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { ExerciseService } from "@/lib/classes/services/ExerciseService"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用問題集の取得")

  return await api.execute("GetManageExercises", async () => {
    await api.checkAccessManagePage(request)

    const schoolId = request.nextUrl.searchParams.get("schoolId") ?? undefined

    const exerciseService = new ExerciseService(prisma)
    const exercises = await exerciseService.getExercisesForManage(schoolId)

    return {
      exercises: exercises.map((exercise) => ({
        exerciseId: exercise.exerciseId,
        title: exercise.title,
        description: exercise.description,
        updatedAt: exercise.updatedAt,
        createdAt: exercise.createdAt,
      })),
    }
  })
}

export function POST(request: NextRequest) {}
