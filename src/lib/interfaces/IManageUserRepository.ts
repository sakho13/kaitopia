import { UserEntity } from "../classes/entities/UserEntity"

export interface IManageUserRepository {
  findGuestUsersOver5Days(): Promise<UserEntity[]>

  /**
   * ユーザ一覧取得する
   * @param limit - 取得件数
   * @param offset - オフセット
   */
  findAll(limit?: number, offset?: number): Promise<UserEntity[]>

  countAllUsers(): Promise<number>

  /**
   * ユーザを論理削除する
   * @param userIds
   */
  deleteUsers(userIds: string[]): Promise<void>
}
