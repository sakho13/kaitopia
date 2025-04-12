import { PrismaClient } from "@prisma/client"

export class ExerciseRepository {
  constructor(private dbConnection: PrismaClient) {}

  public async findExerciseInGlobalSchool(count?: number) {
    return await this.dbConnection.exercise.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        schoolId: true,
      },
      where: {
        school: { isGlobal: true },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: count,
    })
  }

  public async findExerciseById(exerciseId: string) {
    return await this.dbConnection.exercise.findFirst({
      select: {
        id: true,
        title: true,
        description: true,
        exerciseQuestions: {
          select: {
            question: {
              select: {
                id: true,
                title: true,
                currentVersion: true,
              },
            },
          },
        },
      },
      where: {
        id: exerciseId,
      },
    })
  }
}
