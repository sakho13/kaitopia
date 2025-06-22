import { RepositoryBase } from "../common/RepositoryBase"
import { QuestionGroupEntity } from "../entities/QuestionGroupEntity"

export class ManageQuestionGroupRepository extends RepositoryBase {
  public async findGroups(schoolId: string): Promise<QuestionGroupEntity[]> {
    const groups = await this.dbConnection.questionGroup.findMany({
      where: { schoolId, deletedAt: null },
      orderBy: { questionGroupId: "asc" },
    })
    return groups.map(
      (g) =>
        new QuestionGroupEntity({
          schoolId: g.schoolId,
          questionGroupId: g.questionGroupId,
          name: g.name,
          createdAt: g.createdAt,
          updatedAt: g.updatedAt,
          deletedAt: g.deletedAt,
        }),
    )
  }

  public async updateQuestionGroup(
    questionId: string,
    groupId: string | null,
  ): Promise<void> {
    await this.dbConnection.question.update({
      where: { id: questionId },
      data: { questionGroupId: groupId },
    })
  }
}
