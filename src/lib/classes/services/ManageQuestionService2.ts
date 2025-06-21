import { IQuestionRepository } from "@/lib/interfaces/IQuestionRepository"
import { QuestionEntity } from "../entities/QuestionEntity"
import { QuestionVersionEntity } from "../entities/QuestionVersionEntity"

export class ManageQuestionService2 {
  constructor(private readonly _questionRepository: IQuestionRepository) {}

  async getQuestion(questionId: string): Promise<QuestionEntity | null> {
    return this._questionRepository.findById(questionId)
  }

  async getQuestionVersion(
    questionId: string,
    version: number,
  ): Promise<QuestionVersionEntity | null> {
    return this._questionRepository.findVersion(questionId, version)
  }

  async editQuestion(
    question: QuestionEntity,
    data: { title: string },
  ): Promise<QuestionEntity> {
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
    return this._questionRepository.save(newQuestion)
  }
}
