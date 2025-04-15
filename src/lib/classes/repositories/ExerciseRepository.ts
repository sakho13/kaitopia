import { PrismaClient } from "@prisma/client"

export class ExerciseRepository {
  private dbConnection: PrismaClient

  constructor(dbConnection: PrismaClient) {
    this.dbConnection = dbConnection
  }

  public set resetDbConnection(dbConnection: PrismaClient) {
    this.dbConnection = dbConnection
  }

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

  public async findExerciseBySchoolId(schoolId?: string) {
    return await this.dbConnection.exercise.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        schoolId: true,
        createdAt: true,
        updatedAt: true,
        isCanSkip: true,
        isScoringBatch: true,
      },
      where: {
        schoolId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    })
  }

  public async createExercise(
    schoolId: string,
    property: {
      title: string
      description: string
      isCanSkip: boolean
      isScoringBatch: boolean
    },
  ) {
    return await this.dbConnection.exercise.create({
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        schoolId: true,
      },
      data: {
        schoolId,
        ...property,
      },
    })
  }

  // public async insertLogs() {}
}
