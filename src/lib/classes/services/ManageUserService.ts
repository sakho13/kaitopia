import { ServiceBase } from "../common/ServiceBase"
import { UserController } from "../controller/UserController"

/**
 * 管理用ユーザ操作サービスクラス
 */
export class ManageUserService extends ServiceBase {
  private userController: UserController

  constructor(
    userController: UserController,
    ...args: ConstructorParameters<typeof ServiceBase>
  ) {
    super(...args)
    this.userController = userController
  }

  public async getUsersForManage() {
    // 管理者は全てのユーザーを取得できる
    if (this.userController.isAdmin) {
      return []
    }

    return []
  }
}
