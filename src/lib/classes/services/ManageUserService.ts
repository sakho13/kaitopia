import { ApiV1Error } from "../common/ApiV1Error"
import { ServiceBase } from "../common/ServiceBase"
import { UserController } from "../controller/UserController"
import { UserRepository } from "../repositories/UserRepository"

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

  public async getUsersForManageAdmin(limit: number = 10, page: number = 1) {
    // 管理者は全てのユーザーを取得できる
    // その他のユーザは一旦無視
    if (!this.userController.isAdmin)
      throw new ApiV1Error([{ key: "RoleTypeError", params: null }])

    const offset = page ? (page - 1) * limit : undefined

    const userRepository = new UserRepository(this.dbConnection)

    const users = await userRepository.findUsersForAdmin(limit, offset)
    const totalCount = await userRepository.countAllUsers()
    const nextPage = users.length < limit ? null : page ? page + 1 : 2

    return { users, totalCount, nextPage }
  }
}
