import crypto from "node:crypto"

export class StringUtility {
  public static toBase64Url(str: string): string {
    return Buffer.from(str).toString("base64url")
  }

  public static fromBase64Url(base64Url: string): string {
    return Buffer.from(base64Url, "base64url").toString("utf-8")
  }

  /**
   * ハッシュ化を行う
   * アルゴリズムはMD5を使用
   * @param str ハッシュ化する文字列
   * @returns
   */
  public static hashSimply(str: string): string {
    return crypto.createHash("md5").update(str).digest("hex")
  }

  /**
   * 指定された長さのランダムな文字列を生成する
   */
  public static generateRandomString(length: number): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const result = Array.from({ length }, () => {
      const randomIndex = Math.floor(Math.random() * characters.length)
      return characters[randomIndex]
    }).join("")
    return result
  }

  /**
   * 文字列のランダムな位置にランダムな文字を挿入する
   * @param str 挿入対象の文字列
   * @param count 挿入するランダム文字の数
   */
  public static insertRandomCharAtRandomPosition(
    str: string,
    count: number,
  ): string {
    if (count <= 0) return str
    const randomChars = this.generateRandomString(count)
    const result = Array.from(str) // 文字列を配列に変換
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * (result.length + 1))
      result.splice(randomIndex, 0, randomChars[i]) // ランダムな位置に文字を挿入
    }
    return result.join("")
  }

  public static clipTail(str: string, length: number): string {
    if (str.length <= length) {
      return str
    }
    return str.slice(0, length)
  }
}
