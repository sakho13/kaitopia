/**
 * オブジェクトのプロパティが Date 型のみを、string 型に変換する型
 */
export type ReplacedDateToString<T> = {
  [K in keyof T]: T[K] extends Date | null
    ? string | null
    : T[K] extends Date
    ? string
    : T[K] extends object
    ? ReplacedDateToString<T[K]>
    : T[K]
}
