import { RepositoryBase } from "../common/RepositoryBase"

export class QuestionRepository extends RepositoryBase {
  public async findQuestionById(questionId: string) {
    return await this.dbConnection.question.findFirst({
      select: {
        id: true,
        title: true,
        questionType: true,
        answerType: true,
        draftVersion: true,
        currentVersion: true,
      },
      where: {
        id: questionId,
      },
    })
  }

  public async findQuestionsByExerciseId(exerciseId: string) {
    return await this.dbConnection.exerciseQuestion.findMany({
      select: {
        question: {
          select: {
            id: true,
            title: true,
            questionType: true,
            answerType: true,
            draftVersion: true,
            currentVersion: true,
          },
        },
      },
      where: {
        exerciseId: exerciseId,
      },
    })
  }
}
