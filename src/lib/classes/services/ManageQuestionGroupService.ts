import { ServiceBase } from "../common/ServiceBase"
import { ManageQuestionGroupRepository } from "../repositories/ManageQuestionGroupRepository"
import { QuestionGroupEntity } from "../entities/QuestionGroupEntity"
import { UserAuthenticationUtility } from "../utilities/UserAuthenticationUtility"
import { UserEntity } from "../entities/UserEntity"

export class ManageQuestionGroupService extends ServiceBase {
  public async getQuestionGroups(
    user: UserEntity,
    schoolId: string,
  ): Promise<QuestionGroupEntity[]> {
    UserAuthenticationUtility.checkPermissionWithThrow(user, schoolId, "read")

    const repo = new ManageQuestionGroupRepository(this.dbConnection)
    return await repo.findGroups(schoolId)
  }

  public async setQuestionGroups(
    user: UserEntity,
    questionId: string,
    schoolId: string,
    groupIds: string[],
  ): Promise<void> {
    UserAuthenticationUtility.checkPermissionWithThrow(user, schoolId, "edit")

    const repo = new ManageQuestionGroupRepository(this.dbConnection)
    await repo.replaceQuestionGroups(questionId, schoolId, groupIds)
  }
}
