/**
 * ISO 形式の文字列をローカルタイムゾーンに基づく日付に変換するユーティリティクラス
 */
export class DateUtility {
  /**
   * ISO 形式の文字列をローカルタイムゾーンに基づく日付に変換する
   * @param isoString ISO 形式の文字列
   * @returns ローカルタイムゾーンに基づく日付
   */
  public static convertToLocalDate(isoString: string): Date {
    return new Date(isoString)
  }

  /**
   * ISO 形式の文字列をローカルタイムゾーンに基づく日付に変換する
   * @param date
   * @returns ローカルタイムゾーンに基づく日付の文字列
   */
  public static formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
    return new Intl.DateTimeFormat("ja-JP", options).format(date)
  }

  /**
   * ISO 形式の文字列をローカルタイムゾーンに基づく日付に変換する
   * @param date
   * @returns ローカルタイムゾーンに基づく日付の文字列
   */
  public static formatDateTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Intl.DateTimeFormat("ja-JP", options).format(date)
  }
}
