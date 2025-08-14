import { AnswerLogSheetSummary, AnswerLogSheetDetail } from "@/lib/types/base/userLogTypes"

/**
 * ユーザーの回答ログを管理するリポジトリインターフェース
 */
export interface IUserLogRepository {
  /**
   * ユーザーの全ての回答ログシートを取得する
   * @param userId - ユーザーID
   * @param limit - 取得件数
   * @param offset - オフセット
   */
  findAllByUserId(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<AnswerLogSheetSummary[]>

  /**
   * ユーザーの回答ログシート総数を取得する
   * @param userId - ユーザーID
   */
  countAllByUserId(userId: string): Promise<number>

  /**
   * 特定の回答ログシートの詳細を取得する
   * @param userId - ユーザーID
   * @param answerLogSheetId - 回答ログシートID
   */
  findDetailByUserIdAndSheetId(
    userId: string,
    answerLogSheetId: string,
  ): Promise<AnswerLogSheetDetail | null>
}