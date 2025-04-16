import {
  QuestionBase,
  QuestionVersionBase,
} from "@/lib/types/base/questionTypes"
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

  /**
   * @category manage
   */
  public async createQuestion(schoolId: string, question: QuestionBase) {
    return await this.dbConnection.question.create({
      data: {
        schoolId: schoolId,
        title: question.title,
        questionType: question.questionType,
        answerType: question.answerType,
      },
    })
  }

  /**
   * @category manage
   */
  public async createQuestionVersion(
    questionId: string,
    version: number,
    content: QuestionVersionBase,
  ) {
    return await this.dbConnection.questionVersion.create({
      data: {
        questionId: questionId,
        version: version,
        content: content.content,
        hint: content.hint,
      },
    })
  }

  /**
   * @category manage
   */
  public async publishQuestionVersion(questionId: string, version: number) {
    return await this.dbConnection.question.update({
      where: {
        id: questionId,
      },
      data: {
        currentVersionId: version,
        isPublished: true,
        draftVersionId: null,
      },
    })
  }

  /**
   * @category manage
   */
  public async relateQuestionToExercise(
    exerciseId: string,
    questionId: string,
  ) {
    return await this.dbConnection.exerciseQuestion.create({
      data: {
        exerciseId: exerciseId,
        questionId: questionId,
      },
    })
  }
}
