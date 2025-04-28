import { RepositoryBase } from "../common/RepositoryBase"

export class UserQuestionRepository extends RepositoryBase {
  constructor(
    private userId: string,
    ...args: ConstructorParameters<typeof RepositoryBase>
  ) {
    super(...args)
  }

  /**
   * 問題集に紐づく問題を取得する
   * @param exerciseId
   * @returns
   */
  public async findQuestionsByExerciseId(exerciseId: string) {
    return await this.dbConnection.question.findMany({
      select: {
        id: true,
        title: true,
        questionType: true,
        answerType: true,
        currentVersionId: true,
        currentVersion: {
          select: {
            content: true,
            hint: true,
            questionAnswers: {
              select: {
                questionId: true,
                version: true,

                answerId: true,
                isCorrect: false, // ここはfalseで良い
                selectContent: true,
                maxLength: true,
                minLength: true,
              },
            },
          },
        },
      },
      where: {
        exerciseQuestions: { every: { exerciseId } },
        currentVersionId: { not: null },
      },
    })
  }
}
