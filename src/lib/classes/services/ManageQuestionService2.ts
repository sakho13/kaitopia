import { PrismaClient } from "@prisma/client"
import { IQuestionRepository } from "@/lib/interfaces/IQuestionRepository"
import { QuestionEntity } from "../entities/QuestionEntity"
import { QuestionVersionEntity } from "../entities/QuestionVersionEntity"
import { UserEntity } from "../entities/UserEntity"
import { UserAuthenticationUtility } from "../utilities/UserAuthenticationUtility"

export class ManageQuestionService2 {
  constructor(
    private readonly _dbConnection: PrismaClient,
    private readonly _questionRepository: IQuestionRepository,
  ) {}

  async getQuestion(
    user: UserEntity,
    questionId: string,
  ): Promise<QuestionEntity | null> {
    const q = await this._questionRepository.findById(questionId)
    if (!q) return null

    UserAuthenticationUtility.checkPermissionWithThrow(
      user,
      q.value.schoolId,
      "read",
    )
    return q
  }

  async getQuestionVersion(
    questionId: string,
    version: number,
  ): Promise<QuestionVersionEntity | null> {
    return this._questionRepository.findVersion(questionId, version)
  }

  async editQuestion(
    user: UserEntity,
    question: QuestionEntity,
    data: { title: string },
  ): Promise<QuestionEntity> {
    UserAuthenticationUtility.checkPermissionWithThrow(
      user,
      question.value.schoolId,
      "edit",
    )
    const newQuestion = new QuestionEntity({
      ...question.value,
      title: data.title,
    })
    newQuestion.validate()
    return this._questionRepository.save(newQuestion)
  }

  async changeCurrentVersion(
    question: QuestionEntity,
    version: number,
  ): Promise<QuestionEntity> {
    const newQuestion = new QuestionEntity({
      ...question.value,
      currentVersion: version,
    })

    // 編集中バージョンへ更新したときに、編集中バージョンをnullへ
    if (question.value.draftVersion === version) {
      newQuestion.value.draftVersion = null
    }

    if (!question.value.isPublished && question.value.currentVersion !== null) {
      newQuestion.value.isPublished = true
    }

    const updatedQuestion = await this._questionRepository.save(newQuestion)

    return updatedQuestion
  }
}
