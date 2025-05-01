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
        totalCorrectCount: true,
        totalIncorrectCount: true,
        totalUnansweredCount: true,
        _count: { select: { questionUserLogs: true } },

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
   * `findAllAnswerLogSheets()` 検索に合致する総数
   * @param includeInProgress
   * @returns
   */
  public async countAllAnswerLogSheets(includeInProgress: boolean = false) {
    return await this.dbConnection.answerLogSheet.count({
      where: {
        userId: this.userId,
        isInProgress: includeInProgress ? true : undefined,
      },
    })
  }

  /**
   * 回答ログシートを取得する
   * @param answerLogSheetId
   * @param userId
   * @returns
   */
  public async findAnswerLogSheetById(
    answerLogSheetId: string,
    userId: string,
  ) {
    return await this.dbConnection.answerLogSheet.findUnique({
      select: {
        answerLogSheetId: true,
        exerciseId: true,
        isInProgress: true,
        totalCorrectCount: true,
        totalIncorrectCount: true,
        totalUnansweredCount: true,
        questionUserLogs: {
          select: {
            questionUserLogId: true,
            questionId: true,
            version: true,
            orderIndex: true,
            skipped: true,
            score: true,
            questionVersion: {
              select: {
                question: true,
                questionAnswers: {
                  select: {
                    maxLength: true,
                    minLength: true,
                  },
                },
              },
            },
          },
        },
        exercise: {
          select: {
            isScoringBatch: true,
            isCanSkip: true,
          },
        },
      },
      where: {
        userId_answerLogSheetId: {
          userId: userId,
          answerLogSheetId: answerLogSheetId,
        },
      },
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
            questionVersion: {
              select: {
                question: true,
                questionAnswers: {
                  select: {
                    maxLength: true,
                    minLength: true,
                  },
                },
              },
            },
          },
        },
        exercise: {
          select: {
            isScoringBatch: true,
            isCanSkip: true,
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

  // 回答に関連するクエリ

  /**
   * 対象の問題をスキップする
   */
  public async saveSkipQuestionLog(
    answerLogSheetId: string,
    questionUserLogId: string,
    userId: string,
  ) {
    return await this.dbConnection.questionUserLog.update({
      data: {
        skipped: true,
      },
      where: {
        answerLogSheetId,
        questionUserLogId,
        userId,
      },
    })
  }

  /**
   * TYPEが`SELECT/MULTI_SELECT`の問題に回答する
   */
  public async saveSelectQuestionLog(
    answerLogSheetId: string,
    questionUserLogId: string,
    userId: string,
    answer: string[],
  ) {
    return await this.dbConnection.questionUserLog.update({
      data: {
        answerSelectUserLogs: {
          createMany: {
            data: answer.map((a) => ({
              selectAnswerId: a,
              isCorrect: null,
            })),
            skipDuplicates: true,
          },
        },
      },
      where: {
        answerLogSheetId,
        questionUserLogId,
        userId,
      },
    })
  }

  /**
   * TYPEが`SELECT/MULTI_SELECT`の問題に回答する前に実行する
   */
  public async deleteSelectQuestionLog(questionUserLogId: string) {
    return await this.dbConnection.answerSelectUserLog.deleteMany({
      where: {
        questionUserLogId,
      },
    })
  }

  /**
   * TYPEが`TEXT`の問題に回答する
   */
  public async saveTextQuestionLog(
    answerLogSheetId: string,
    questionUserLogId: string,
    userId: string,
    answer: string,
  ) {
    return await this.dbConnection.questionUserLog.update({
      data: {
        textAnswer: answer,
      },
      where: {
        answerLogSheetId,
        questionUserLogId,
        userId,
      },
    })
  }
}
