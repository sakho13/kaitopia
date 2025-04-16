import { RepositoryBase } from "../common/RepositoryBase"

export class ExerciseRepository extends RepositoryBase {
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

  /**
   * 進行中の問題集を取得/登録する
   */
  public async getLogSheetInProgress(userId: string, exerciseId: string) {
    // return await this.dbConnection.$transaction(async (tx) => {
    //   const logSheetInProgress = await tx.answerLogSheet.findFirst({
    //     where: {
    //       isInProgress: true,
    //       userId,
    //       exerciseId,
    //     },
    //   })
    //   if (logSheetInProgress) return logSheetInProgress
    //   return await tx.answerLogSheet.create({
    //     data: {
    //       userId,
    //       exerciseId,
    //       isInProgress: true,
    //     },
    //   })
    // })
  }
}
