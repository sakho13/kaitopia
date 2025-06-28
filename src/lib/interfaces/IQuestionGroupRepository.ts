export interface IQuestionGroupRepository {
  findByQuestionIds(questionIds: string[]): Promise<{
    questionId: string
    groups: import("../classes/entities/QuestionGroupEntity").QuestionGroupEntity[]
  }[]>
}
