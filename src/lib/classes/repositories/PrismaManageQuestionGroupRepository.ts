import { RepositoryBase } from "../common/RepositoryBase"
import { QuestionGroupEntity } from "../entities/QuestionGroupEntity"

export class PrismaManageQuestionGroupRepository extends RepositoryBase {
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

  public async replaceQuestionGroups(
    questionId: string,
    schoolId: string,
    groupIds: string[],
  ): Promise<void> {
    await this.dbConnection.questionGroupQuestion.deleteMany({
      where: { questionId },
    })

    if (groupIds.length > 0) {
      await this.dbConnection.questionGroupQuestion.createMany({
        data: groupIds.map((id) => ({
          questionId,
          schoolId,
          questionGroupId: id,
        })),
      })
    }
  }
}
