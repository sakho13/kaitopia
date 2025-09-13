import { IUserLogRepository } from "@/lib/interfaces/IUserLogRepository"
import { UserEntity } from "../entities/UserEntity"
import { AnswerLogSheetSummary, AnswerLogSheetDetail } from "@/lib/types/base/userLogTypes"
import { ApiV1Error } from "../common/ApiV1Error"

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

  /**
   * ユーザーの演習結果一覧を取得する
   * @param user - ユーザーエンティティ
   * @param limit - 取得件数
   * @param page - ページ番号(1から開始)
   * @param ignoreInProgress - 進行中を除外するかどうか
   */
  async getExerciseResults(
    user: UserEntity,
    limit: number = 10,
    page: number = 1,
    ignoreInProgress: boolean = false,
  ): Promise<{
    answerLogSheets: AnswerLogSheetSummary[]
    nextPage: number | null
    totalCount: number
  }> {
    const offset = (page - 1) * limit
    
    const [answerLogSheets, totalCount] = await Promise.all([
      this._userLogRepository.findAllByUserId(user.userId, limit, offset),
      this._userLogRepository.countAllByUserId(user.userId),
    ])

    // ignoreInProgressがtrueの場合、進行中のものを除外
    const filteredSheets = ignoreInProgress 
      ? answerLogSheets.filter(sheet => !sheet.isInProgress)
      : answerLogSheets

    const hasNextPage = offset + limit < totalCount
    const nextPage = hasNextPage ? page + 1 : null

    return {
      answerLogSheets: filteredSheets,
      nextPage,
      totalCount,
    }
  }

  /**
   * 特定の回答ログシートの詳細を取得する
   * @param user - ユーザーエンティティ
   * @param answerLogSheetId - 回答ログシートID
   */
  async getAnswerLogSheetDetail(
    user: UserEntity,
    answerLogSheetId: string,
  ): Promise<AnswerLogSheetDetail> {
    const sheet = await this._userLogRepository.findDetailByUserIdAndSheetId(
      user.userId,
      answerLogSheetId,
    )

    if (!sheet) {
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])
    }

    return sheet
  }
}