import { isStrictISO8601 } from "@/lib/functions/isStrictIso8601"

describe("lib/functions/isStrictISO8601", () => {
  test("UTC日時文字列", () => {
    expect(isStrictISO8601("2020-01-01T00:00:00.000Z")).toBe(true)
  })

  test("日本時間日時文字列_タイムゾーン指定", () => {
    expect(isStrictISO8601("2020-01-01T00:00:00.000+09:00")).toBe(true)
  })

  test("ISO8601形式ではない文字列", () => {
    expect(isStrictISO8601("2020-01-01 00:00:00")).toBe(false)
  })
})
