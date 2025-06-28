import { UserEntity } from "../classes/entities/UserEntity"

export interface IManageUserRepository {
  findGuestUsersOver5Days(): Promise<UserEntity[]>

  /**
   * ユーザを論理削除する
   * @param userIds
   */
  deleteUsers(userIds: string[]): Promise<void>
}
