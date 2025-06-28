import { RepositoryBase } from "../common/RepositoryBase";
import { QuestionGroupEntity } from "../entities/QuestionGroupEntity";
import { IQuestionGroupRepository } from "@/lib/interfaces/IQuestionGroupRepository";

export class PrismaQuestionGroupRepository
  extends RepositoryBase
  implements IQuestionGroupRepository
{
  async findByQuestionIds(questionIds: string[]) {
    if (questionIds.length === 0) return [];
    const rows = await this.dbConnection.questionGroupQuestion.findMany({
      where: { questionId: { in: questionIds } },
      include: { questionGroup: true },
    });
    const map: Record<string, QuestionGroupEntity[]> = {};
    for (const r of rows) {
      if (!map[r.questionId]) map[r.questionId] = [];
      const g = r.questionGroup;
      map[r.questionId].push(
        new QuestionGroupEntity({
          schoolId: g.schoolId,
          questionGroupId: g.questionGroupId,
          name: g.name,
          createdAt: g.createdAt,
          updatedAt: g.updatedAt,
          deletedAt: g.deletedAt,
        }),
      );
    }
    return Object.entries(map).map(([questionId, groups]) => ({
      questionId,
      groups,
    }));
  }
}
