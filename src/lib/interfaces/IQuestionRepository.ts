import { QuestionEntity } from "../classes/entities/QuestionEntity"
import { QuestionVersionEntity } from "../classes/entities/QuestionVersionEntity"

export interface IQuestionRepository {
  findById(questionId: string): Promise<QuestionEntity | null>
  findVersion(
    questionId: string,
    version: number,
  ): Promise<QuestionVersionEntity | null>
  save(question: QuestionEntity): Promise<QuestionEntity>
}
