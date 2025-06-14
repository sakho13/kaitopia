import {
  QuestionAnswerTypeType,
  QuestionTypeType,
} from "@/lib/types/base/questionTypes"
import { RepositoryBase } from "../common/RepositoryBase"
import { DateUtility } from "../common/DateUtility"

export class ManageQuestionRepository extends RepositoryBase {
  public async getQuestionDetails(questionId: string) {
    return await this.dbConnection.question.findUnique({
      select: {
        schoolId: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,

        questionType: true,
        answerType: true,
        isPublished: true,
        currentVersionId: true,
        currentVersion: true,
        draftVersionId: true,
        draftVersion: true,

        versions: {
          select: {
            version: true,
            content: true,
            hint: true,

            createdAt: true,
            updatedAt: true,
          },
        },
      },
      where: {
        id: questionId,
      },
    })
  }

  public async getQuestionVersion(questionId: string, version: number) {
    return await this.dbConnection.questionVersion.findFirst({
      select: {
        content: true,
        hint: true,
        createdAt: true,
        updatedAt: true,
        question: {
          select: {
            schoolId: true,
          },
        },
      },
      where: {
        questionId: questionId,
        version: version,
      },
    })
  }

  public async createQuestion(
    schoolId: string,
    title: string,
    questionType: QuestionTypeType,
    answerType: QuestionAnswerTypeType,
  ) {
    return await this.dbConnection.question.create({
      data: {
        schoolId,
        title: title,
        questionType: questionType,
        answerType: answerType,
      },
    })
  }

  public async deleteQuestion(questionId: string) {
    return await this.dbConnection.question.update({
      data: {
        deletedAt: DateUtility.getNowDate(),
      },
      where: {
        id: questionId,
      },
    })
  }

  public async createNewVersion(
    questionId: string,
    version: number,
    data: {
      content: string
      hint?: string
    },
  ) {
    return await this.dbConnection.questionVersion.create({
      data: {
        questionId: questionId,
        version: version,
        content: data.content,
        hint: data.hint,
      },
    })
  }

  public async createQuestionAnswer(
    questionId: string,
    version: number,
    data: Partial<{
      selectContent: string
      isCorrect: boolean
      minLength: number
      maxLength: number
    }>[],
  ) {
    return await this.dbConnection.questionAnswer.createMany({
      data: data.map((item) => ({
        questionId: questionId,
        version: version,
        selectContent: item.selectContent,
        isCorrect: item.isCorrect,
        minLength: item.minLength,
        maxLength: item.maxLength,
      })),
    })
  }

  public async changeDraftVersion(questionId: string, version: number) {
    return await this.dbConnection.question.update({
      data: {
        draftVersionId: version,
      },
      where: {
        id: questionId,
      },
    })
  }

  public async changeCurrentVersion(questionId: string, version: number) {
    return await this.dbConnection.question.update({
      data: {
        currentVersionId: version,
      },
      where: {
        id: questionId,
      },
    })
  }

  /**
   * 問題集と問題を関連付ける
   */
  public async relateQuestionToExercise(
    questionId: string,
    exerciseId: string,
  ) {
    return await this.dbConnection.exerciseQuestion.create({
      data: {
        questionId: questionId,
        exerciseId: exerciseId,
      },
    })
  }
}
