import { UserHistoryEntity } from "../classes/entities/UserHistoryEntity"

export interface IUserHistoryRepository {
  /**
   * ユーザ履歴を追加する
   * @param userHistory historyNoは自動でインクリメントされる
   */
  addUserHistory(userHistory: UserHistoryEntity): Promise<UserHistoryEntity>
}
