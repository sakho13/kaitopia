import { ServiceBase } from "../common/ServiceBase"
import { PrismaManageQuestionGroupRepository } from "../repositories/PrismaManageQuestionGroupRepository"
import { QuestionGroupEntity } from "../entities/QuestionGroupEntity"
import { UserAuthenticationUtility } from "../utilities/UserAuthenticationUtility"
import { UserEntity } from "../entities/UserEntity"

export class ManageQuestionGroupService extends ServiceBase {
  public async getQuestionGroups(
    user: UserEntity,
    schoolId: string,
  ): Promise<QuestionGroupEntity[]> {
    UserAuthenticationUtility.checkPermissionWithThrow(user, schoolId, "read")

    const repo = new PrismaManageQuestionGroupRepository(this.dbConnection)
    return await repo.findGroups(schoolId)
  }

  public async setQuestionGroups(
    user: UserEntity,
    questionId: string,
    schoolId: string,
    groupIds: string[],
  ): Promise<void> {
    UserAuthenticationUtility.checkPermissionWithThrow(user, schoolId, "edit")

    const repo = new PrismaManageQuestionGroupRepository(this.dbConnection)
    await repo.replaceQuestionGroups(questionId, schoolId, groupIds)
  }
}
