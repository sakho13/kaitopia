/**
 * ISO 8601形式の文字列かどうかを判定する
 *
 * @example UTC isStrictISO8601("2020-01-01T00:00:00.000Z")
 * @example JST isStrictISO8601("2020-01-01T00:00:00.000+09:00")
 */
export function isStrictISO8601(str: string): boolean {
  const iso8601Regex =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[\+\-]\d{2}:\d{2})$/

  return iso8601Regex.test(str) && !isNaN(Date.parse(str))
}
