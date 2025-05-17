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
      answerIds: string[]
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
            selectAnswerOrder: true,
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
              selectAnswerOrder: q.answerIds,
            })),
          },
        },
      },
    })
  }

  public async resetAnswerLogSheetById(answerLogSheetId: string) {
    return await this.dbConnection.answerLogSheet.delete({
      where: {
        userId_answerLogSheetId: {
          userId: this.userId,
          answerLogSheetId: answerLogSheetId,
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
  public async findAllAnswerLogSheets(limit: number = 100, offset: number = 0) {
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
            id: true,
            title: true,
          },
        },

        createdAt: true,
        updatedAt: true,
      },
      where: {
        userId: this.userId,
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
   * 結果確認用の回答ログシートを取得する
   */
  public async findAnswerLogSheetForResultById(answerLogSheetId: string) {
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
            textAnswer: true,
            selectAnswerOrder: true,
            questionVersion: {
              select: {
                question: {
                  select: {
                    id: true,
                    title: true,
                    questionType: true,
                    answerType: true,
                  },
                },
                questionAnswers: {
                  select: {
                    answerId: true,
                    selectContent: true,
                    isCorrect: true,
                    maxLength: true,
                    minLength: true,
                  },
                },
                hint: true,
                content: true,
              },
            },
            answerSelectUserLogs: {
              select: {
                answerSelectUserLogId: true,

                selectAnswerId: true,
                isCorrect: true,
                questionAnswer: {
                  select: {
                    selectContent: true,
                    maxLength: true,
                    minLength: true,
                    isCorrect: true,
                  },
                },
              },
            },
          },
          orderBy: { orderIndex: "asc" },
        },
        exercise: {
          select: {
            id: true,
            title: true,
            description: true,
            isScoringBatch: true,
            isCanSkip: true,
          },
        },
        createdAt: true,
        updatedAt: true,

        _count: {
          select: {
            questionUserLogs: true,
          },
        },
      },
      where: {
        userId_answerLogSheetId: {
          userId: this.userId,
          answerLogSheetId: answerLogSheetId,
        },
      },
    })
  }

  /**
   * 回答ログシートを取得する
   * @param answerLogSheetId
   * @param userId
   * @returns
   */
  public async findAnswerLogSheetById(answerLogSheetId: string) {
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
          userId: this.userId,
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
            isAnswered: true,
            orderIndex: true,
            selectAnswerOrder: true,
            skipped: true,
            isCorrect: true,
            score: true,
            questionVersion: {
              select: {
                question: true,
                questionId: true,
                version: true,
                questionAnswers: {
                  select: {
                    answerId: true,
                    selectContent: true,
                    isCorrect: true,

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
        totalCorrectCount: true,
        totalIncorrectCount: true,
        totalUnansweredCount: true,
        isInProgress: true,
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
    questionId: string,
    version: number,
    questionUserLogId: string,
  ) {
    return await this.dbConnection.questionUserLog.update({
      data: {
        skipped: true,
      },
      where: {
        questionId,
        version,
        questionUserLogId,
        userId: this.userId,
      },
    })
  }

  /**
   * TYPEが`SELECT/MULTI_SELECT`の問題に回答する
   */
  public async saveSelectQuestionLog(
    questionId: string,
    version: number,
    questionUserLogId: string,
    answer: string[],
  ) {
    return await this.dbConnection.questionUserLog.update({
      data: {
        isCorrect: false, // 採点は後で行う
        answerSelectUserLogs: {
          createMany: {
            data: answer.map((a) => ({
              selectAnswerId: a,
              isCorrect: false,
              questionId,
              version,
            })),
            skipDuplicates: true,
          },
        },
      },
      where: {
        questionUserLogId,
        userId: this.userId,
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
    questionId: string,
    version: number,
    questionUserLogId: string,
    answer: string,
  ) {
    return await this.dbConnection.questionUserLog.update({
      data: {
        textAnswer: answer,
        score: 0, // 採点は後で行う
      },
      where: {
        questionId,
        version,
        questionUserLogId,
        userId: this.userId,
      },
    })
  }

  // 採点に関連するクエリ

  /**
   * TYPEが`SELECT/MULTI_SELECT`の問題が正答と判断された場合に実行する
   */
  public async saveSelectQuestionScore(
    answerLogSheetId: string,
    questionUserLogId: string,
  ) {
    return await this.dbConnection.questionUserLog.update({
      data: {
        isAnswered: true,
        isCorrect: true,
      },
      where: {
        answerLogSheetId,
        questionUserLogId,
        userId: this.userId,
      },
    })
  }

  public async saveScore(
    answerLogSheetId: string,
    questionUserLogId: string,
    score: number,
  ) {
    return await this.dbConnection.questionUserLog.update({
      data: {
        isAnswered: true,
        score: score,
      },
      where: {
        answerLogSheetId,
        questionUserLogId,
        userId: this.userId,
      },
    })
  }

  public async completeAnswerLogSheet(answerLogSheetId: string) {
    return await this.dbConnection.answerLogSheet.update({
      data: {
        isInProgress: false,
      },
      where: {
        userId_answerLogSheetId: {
          answerLogSheetId,
          userId: this.userId,
        },
      },
    })
  }

  public async updateTotalCorrectCount(answerLogSheetId: string) {
    return await this.dbConnection.answerLogSheet.update({
      data: {
        totalCorrectCount: {
          increment: 1,
        },
      },
      where: {
        userId_answerLogSheetId: {
          answerLogSheetId,
          userId: this.userId,
        },
      },
    })
  }

  public async updateTotalIncorrectCount(answerLogSheetId: string) {
    return await this.dbConnection.answerLogSheet.update({
      data: {
        totalIncorrectCount: {
          increment: 1,
        },
      },
      where: {
        userId_answerLogSheetId: {
          answerLogSheetId,
          userId: this.userId,
        },
      },
    })
  }

  public async updateTotalUnansweredCount(answerLogSheetId: string) {
    return await this.dbConnection.answerLogSheet.update({
      data: {
        totalUnansweredCount: {
          increment: 1,
        },
      },
      where: {
        userId_answerLogSheetId: {
          answerLogSheetId,
          userId: this.userId,
        },
      },
    })
  }
}
