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
    })
  }

  async findVersion(
    questionId: string,
    version: number,
  ): Promise<QuestionVersionEntity | null> {
    const v = await this.dbConnection.questionVersion.findUnique({
      where: { questionId_version: { questionId, version } },
    })
    if (!v) return null
    return new QuestionVersionEntity({
      questionId: v.questionId,
      version: v.version,
      content: v.content,
      hint: v.hint,
    })
  }

  async save(question: QuestionEntity): Promise<QuestionEntity> {
    const q = await this.dbConnection.question.update({
      where: { id: question.value.questionId },
      data: {
        title: question.value.title,
        currentVersionId: question.value.currentVersion,
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
    })
  }
}
