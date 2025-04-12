import { joincn } from "@/lib/functions/joincn"

describe("lib/functions/joincn", () => {
  test("空配列", () => {
    const result = joincn()
    expect(result).toBe("")
  })

  test("空文字列", () => {
    const result = joincn("")
    expect(result).toBe("")
  })

  test("空文字列と文字列", () => {
    const result = joincn("", "test")
    expect(result).toBe("test")
  })

  test("文字列と空文字列", () => {
    const result = joincn("test", "")
    expect(result).toBe("test")
  })

  test("文字列と文字列", () => {
    const result = joincn("test", "test2")
    expect(result).toBe("test test2")
  })
})
