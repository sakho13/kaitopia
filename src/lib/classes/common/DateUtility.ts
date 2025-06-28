/**
 * ISO 形式の文字列をローカルタイムゾーンに基づく日付に変換するユーティリティクラス
 */
export class DateUtility {
  /**
   * ローカル時間をDateオブジェクトを取得する
   * @returns 現在のローカル時間を表すDateオブジェクト
   */
  public static getNowDate() {
    return new Date()
  }

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

  /**
   * ローカル時間に基づく日時を`yyyymmddhhmmssSSS`形式の文字列に変換する
   * @returns `yyyymmddhhmmssSSS`形式の文字列
   */
  public static generateDateStringNow(): string {
    const now = this.getNowDate()
    const year = now.getFullYear().toString().padStart(4, "0")
    const month = (now.getMonth() + 1).toString().padStart(2, "0")
    const day = now.getDate().toString().padStart(2, "0")
    const hours = now.getHours().toString().padStart(2, "0")
    const minutes = now.getMinutes().toString().padStart(2, "0")
    const seconds = now.getSeconds().toString().padStart(2, "0")
    const milliseconds = now.getMilliseconds().toString().padStart(3, "0")
    return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`
  }

  /**
   * 指定した日数だけ前の日付を取得する
   * @param days 日数
   * @param base 基準となる日付（省略可能、デフォルトは現在の日付）
   * @returns 指定した日数だけ前の日付
   *
   * @example
   * // 5日前の日付を取得
   * const fiveDaysAgo = DateUtility.getBeforeDaysDate(5)
   * console.log(fiveDaysAgo) // 現在の日付から5日前の日付が表示される
   */
  public static getBeforeDaysDate(days: number, base?: Date): Date {
    const now = base || this.getNowDate()
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
  }
}
