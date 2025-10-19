import { PrismaClient } from "@prisma/client"
import { ApiV1Error } from "../common/ApiV1Error"
import { UserEntity } from "../entities/UserEntity"
import { IExternalAuthenticationRepository } from "@/lib/interfaces/IExternalAuthenticationRepository"
import { IManageUserRepository } from "@/lib/interfaces/IManageUserRepository"
import { PrismaManageUserRepository } from "../repositories/PrismaManageUserRepository"

/**
 * 管理用ユーザ操作サービスクラス
 */
export class ManageUserService2 {
  constructor(
    private readonly _dbConnection: PrismaClient,
    private readonly _userRepo: IManageUserRepository,
    private readonly _externalAuthRepo: IExternalAuthenticationRepository,
  ) {}

  /**
   * ゲストユーザを一括削除する
   * @description もしもユーザ数が増加した場合に、処理が重くなるため改善の余地あり
   */
  public async deleteGuestUsers(user: UserEntity): Promise<{
    deletedUserCount: number
    deletedUserIds: string[]
  }> {
    if (!user.isAdmin) {
      throw new ApiV1Error([{ key: "RoleTypeError", params: null }])
    }

    const guestUsers = await this._userRepo.findGuestUsersOver5Days()
    if (guestUsers.length === 0) {
      return {
        deletedUserCount: 0,
        deletedUserIds: [],
      }
    }

    const deletedUserIds = await this._dbConnection.$transaction(async (tx) => {
      // 認証プロバイダ側から削除
      const deletedFromAuthProvider = await this._externalAuthRepo.deleteUsers(
        guestUsers.map((user) => user.value.firebaseUid),
      )
      if (deletedFromAuthProvider.errors.length > 0) {
        throw new ApiV1Error(
          [
            {
              key: "NotFoundError",
              params: null,
            },
          ],
          {
            cause: deletedFromAuthProvider.errors.toString(),
          },
        )
      }

      // ユーザの削除日時を更新
      const userIds = guestUsers.map((user) => user.userId)
      const userRepo = new PrismaManageUserRepository(tx)
      await userRepo.deleteUsers(userIds)

      return userIds
    })

    return {
      deletedUserCount: deletedUserIds.length,
      deletedUserIds,
    }
  }
}
