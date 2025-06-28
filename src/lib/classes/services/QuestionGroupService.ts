import { PrismaClient } from "@prisma/client";
import { IQuestionGroupRepository } from "@/lib/interfaces/IQuestionGroupRepository";

export class QuestionGroupService {
  constructor(
    private readonly _dbConnection: PrismaClient,
    private readonly _questionGroupRepository: IQuestionGroupRepository,
  ) {}

  async getGroups(questionIds: string[]) {
    return this._questionGroupRepository.findByQuestionIds(questionIds);
  }
}
