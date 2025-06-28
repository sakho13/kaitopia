import { IQuestionRepository } from "@/lib/interfaces/IQuestionRepository"
import { RepositoryBase } from "../common/RepositoryBase"
import { QuestionEntity } from "../entities/QuestionEntity"
import { QuestionVersionEntity } from "../entities/QuestionVersionEntity"

export class PrismaQuestionRepository
  extends RepositoryBase
  implements IQuestionRepository
{
  async findById(questionId: string): Promise<QuestionEntity | null> {
    const q = await this.dbConnection.question.findUnique({
      include: {
        versions: {
          include: { questionAnswers: true },
        },
      },
      where: { id: questionId },
    })
    if (!q) return null
    return new QuestionEntity({
      questionId: q.id,
      schoolId: q.schoolId,
      title: q.title,
      questionType: q.questionType,
      answerType: q.answerType,
      currentVersion: q.currentVersionId,
      draftVersion: q.draftVersionId,
      isPublished: q.isPublished,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
      deletedAt: q.deletedAt,
      versions: q.versions.map((v) => {
        return new QuestionVersionEntity({
          questionId: v.questionId,
          questionType: q.questionType,
          answerType: q.answerType,

          version: v.version,
          content: v.content,
          hint: v.hint,
          questionAnswers: v.questionAnswers.map((a) => {
            return {
              answerId: a.answerId,
              selectContent: a.selectContent,
              isCorrect: a.isCorrect,
              maxLength: a.maxLength,
              minLength: a.minLength,
            }
          }),
        })
      }),
    })
  }

  async findVersion(
    questionId: string,
    version: number,
  ): Promise<QuestionVersionEntity | null> {
    const v = await this.dbConnection.questionVersion.findUnique({
      where: { questionId_version: { questionId, version } },
      include: {
        questionAnswers: true,
        question: {
          select: {
            questionType: true,
            answerType: true,
          },
        },
      },
    })
    if (!v) return null
    return new QuestionVersionEntity({
      questionId: v.questionId,
      questionType: v.question.questionType,
      answerType: v.question.answerType,

      version: v.version,
      content: v.content,
      hint: v.hint,
      questionAnswers: v.questionAnswers.map((a) => {
        return {
          answerId: a.answerId,
          selectContent: a.selectContent,
          isCorrect: a.isCorrect,
          maxLength: a.maxLength,
          minLength: a.minLength,
        }
      }),
    })
  }

  async save(question: QuestionEntity): Promise<QuestionEntity> {
    const q = await this.dbConnection.question.update({
      where: { id: question.value.questionId },
      data: {
        title: question.value.title,
        currentVersionId: question.value.currentVersion,
      },
      include: {
        versions: {
          include: { questionAnswers: true },
        },
      },
    })
    return new QuestionEntity({
      questionId: q.id,
      schoolId: q.schoolId,
      title: q.title,
      questionType: q.questionType,
      answerType: q.answerType,
      currentVersion: q.currentVersionId,
      draftVersion: q.draftVersionId,
      isPublished: q.isPublished,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
      deletedAt: q.deletedAt,
      versions: question.value.versions.map((v) => {
        return new QuestionVersionEntity({
          questionId: v.value.questionId,
          questionType: q.questionType,
          answerType: q.answerType,

          version: v.value.version,
          content: v.value.content,
          hint: v.value.hint,
          questionAnswers: v.value.questionAnswers.map((a) => {
            return {
              answerId: a.answerId,
              selectContent: a.selectContent,
              isCorrect: a.isCorrect,
              maxLength: a.maxLength,
              minLength: a.minLength,
            }
          }),
        })
      }),
    })
  }
}
