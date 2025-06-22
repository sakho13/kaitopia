import { ApiV1Error } from "../common/ApiV1Error"
import { ServiceBase } from "../common/ServiceBase"
import { UserController } from "../controller/UserController"
import { ManageQuestionGroupRepository } from "../repositories/ManageQuestionGroupRepository"
import { QuestionGroupEntity } from "../entities/QuestionGroupEntity"

export class ManageQuestionGroupService extends ServiceBase {
  private userController: UserController

  constructor(userController: UserController, ...args: ConstructorParameters<typeof ServiceBase>) {
    super(...args)
    this.userController = userController
  }

  public async getQuestionGroups(schoolId: string): Promise<QuestionGroupEntity[]> {
    const access = await this.userController.accessSchoolMethod(schoolId)
    if (!access.includes("read"))
      throw new ApiV1Error([{ key: "RoleTypeError", params: null }])

    const repo = new ManageQuestionGroupRepository(this.dbConnection)
    return await repo.findGroups(schoolId)
  }

  public async setQuestionGroups(
    questionId: string,
    schoolId: string,
    groupIds: string[],
  ): Promise<void> {
    const access = await this.userController.accessSchoolMethod(schoolId)
    if (!access.includes("edit"))
      throw new ApiV1Error([{ key: "RoleTypeError", params: null }])

    const repo = new ManageQuestionGroupRepository(this.dbConnection)
    await repo.replaceQuestionGroups(questionId, schoolId, groupIds)
  }
}
