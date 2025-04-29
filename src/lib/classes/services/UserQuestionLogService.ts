import { ApiV1Error } from "../common/ApiV1Error"
import { ServiceBase } from "../common/ServiceBase"
import { UserController } from "../controller/UserController"
import { UserLogRepository } from "../repositories/UserLogRepository"

export class UserQuestionLogService extends ServiceBase {
  private userController: UserController

  constructor(
    userController: UserController,
    ...args: ConstructorParameters<typeof ServiceBase>
  ) {
    super(...args)
    this.userController = userController
  }

  /**
   * 問題の回答履歴を一覧で取得する(進行中も含む)
   * @param limit
   * @param page
   * @returns
   */
  public async getAnswerLogSheets(limit: number = 10, page?: number) {
    const offset = page ? (page - 1) * limit : undefined
    const userLogRepository = new UserLogRepository(
      this._userId,
      this.dbConnection,
    )

    const answerLogSheets = await userLogRepository.findAllAnswerLogSheets(
      true,
      limit,
      offset,
    )

    return answerLogSheets
  }

  /**
   * 1週間の回答履歴をダッシュボード用で取得する
   *
   * - 日曜日開始で各曜日の問題の回答数
   */
  // public async getWeeklyAnswerLog() {
  //   return {}
  // }

  private get _userId() {
    if (this.userController.userId === null)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])
    return this.userController.userId
  }
}
