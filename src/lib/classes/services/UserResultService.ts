import { IUserLogRepository } from "@/lib/interfaces/IUserLogRepository"
import { UserEntity } from "../entities/UserEntity"
import { AnswerLogSheetSummary } from "@/lib/types/base/userLogTypes"

/**
 * ユーザーの回答結果を管理するサービス
 */
export class UserResultService {
  constructor(private readonly _userLogRepository: IUserLogRepository) {}

  /**
   * ユーザーの回答ログ一覧を取得する
   * @param user - ユーザーエンティティ
   * @param limit - 取得件数
   * @param page - ページ番号(1から開始)
   */
  async getAnswerLogs(
    user: UserEntity,
    limit: number = 10,
    page: number = 1,
  ): Promise<{
    resultLogs: AnswerLogSheetSummary[]
    nextPage: number | null
    totalCount: number
  }> {
    const offset = (page - 1) * limit
    
    const [resultLogs, totalCount] = await Promise.all([
      this._userLogRepository.findAllByUserId(user.userId, limit, offset),
      this._userLogRepository.countAllByUserId(user.userId),
    ])

    const hasNextPage = offset + limit < totalCount
    const nextPage = hasNextPage ? page + 1 : null

    return {
      resultLogs,
      nextPage,
      totalCount,
    }
  }
}