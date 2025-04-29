import { RepositoryBase } from "../common/RepositoryBase"

export class UserLogRepository extends RepositoryBase {
  constructor(
    private userId: string,
    ...args: ConstructorParameters<typeof RepositoryBase>
  ) {
    super(...args)
  }

  /**
   * 問題集のログシートを新規で作成する
   * @param exerciseId
   * @param questions 出題順で並べている状態であること
   * @returns
   */
  public async createExerciseAnswerLogSheetByQuestions(
    exerciseId: string,
    questions: {
      questionId: string
      version: number
    }[],
  ) {
    return await this.dbConnection.answerLogSheet.create({
      select: {
        answerLogSheetId: true,
        questionUserLogs: {
          select: {
            questionUserLogId: true,
            questionId: true,
            version: true,
            orderIndex: true,
          },
        },
      },
      data: {
        userId: this.userId,
        exerciseId: exerciseId,
        isInProgress: true,
        questionUserLogs: {
          createMany: {
            skipDuplicates: true,
            data: questions.map((q, i) => ({
              questionId: q.questionId,
              version: q.version,
              orderIndex: i + 1,
            })),
          },
        },
      },
    })
  }

  /**
   * ユーザが回答した履歴も確認できるように
   * @param includeInProgress
   * @param limit
   * @param offset
   * @returns
   */
  public async findAllAnswerLogSheets(
    includeInProgress: boolean = false,
    limit: number = 100,
    offset: number = 0,
  ) {
    return await this.dbConnection.answerLogSheet.findMany({
      select: {
        answerLogSheetId: true,
        isInProgress: true,

        exerciseId: true,
        exercise: {
          select: {
            title: true,
          },
        },

        createdAt: true,
        updatedAt: true,
      },
      where: {
        userId: this.userId,
        isInProgress: includeInProgress ? true : undefined,
      },
      take: limit,
      skip: offset,
      orderBy: [{ updatedAt: "desc" }],
    })
  }

  /**
   * 問題集に紐づく最新の回答中の回答ログシートを取得する
   */
  public async findLatestAnswerLogSheetByExerciseId(exerciseId: string) {
    return await this.dbConnection.answerLogSheet.findFirst({
      select: {
        answerLogSheetId: true,
        exerciseId: true,
        questionUserLogs: {
          select: {
            questionUserLogId: true,
            questionId: true,
            version: true,
            orderIndex: true,
            skipped: true,
            score: true,
            answerUserLogs: true,
          },
        },
      },
      where: {
        userId: this.userId,
        exerciseId: exerciseId,
        isInProgress: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    })
  }
}
