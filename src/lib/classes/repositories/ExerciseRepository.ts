import { RepositoryBase } from "../common/RepositoryBase"

export class ExerciseRepository extends RepositoryBase {
  public async findExerciseInGlobalSchool(
    count?: number,
    isPublished?: boolean,
  ) {
    return await this.dbConnection.exercise.findMany({
      select: {
        id: true,
        title: true,
        isPublished: true,
        description: true,
        schoolId: true,
      },
      where: {
        school: { isGlobal: true },
        isPublished: isPublished,
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
                questionType: true,
                answerType: true,
                currentVersion: true,
              },
            },
          },
        },
        createdAt: true,
        updatedAt: true,
        schoolId: true,
        isPublished: true,
        isCanSkip: true,
        isScoringBatch: true,
        _count: {
          select: {
            exerciseQuestions: true,
          },
        },
      },
      where: {
        id: exerciseId,
        deletedAt: null,
      },
    })
  }

  public async findExerciseBySchoolId(
    schoolId?: string,
    limit?: number,
    offset?: number,
  ) {
    return await this.dbConnection.exercise.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        schoolId: true,
        createdAt: true,
        updatedAt: true,
        isPublished: true,
        isCanSkip: true,
        isScoringBatch: true,
        _count: {
          select: {
            exerciseQuestions: true,
          },
        },
      },
      where: {
        schoolId,
        deletedAt: null,
      },
      take: limit,
      skip: offset,
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    })
  }

  public async countExerciseBySchoolId(schoolId?: string) {
    return await this.dbConnection.exercise.count({
      where: {
        schoolId,
        deletedAt: null,
      },
    })
  }

  public async createExercise(
    schoolId: string,
    property: {
      title: string
      description: string
      isPublished: boolean
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

  public async updateExercise(
    exerciseId: string,
    property: Partial<{
      title: string
      description: string
    }>,
  ) {
    return await this.dbConnection.exercise.update({
      data: {
        ...property,
      },
      where: {
        id: exerciseId,
      },
    })
  }

  public async deleteExercise(exerciseId: string) {
    return await this.dbConnection.exercise.update({
      where: {
        id: exerciseId,
      },
      data: {
        deletedAt: new Date(),
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
