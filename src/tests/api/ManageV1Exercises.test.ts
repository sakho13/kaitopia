/**
 * @jest-environment node
 */

import { GET } from "@/app/api/manage/v1/exercises/route"
import { TestUtility } from "@/tests/TestUtility"
import { NextRequest } from "next/server"

describe("API /api/manage/v1/exercises", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("アクセス権限チェック", () => {
    test("ADMINユーザ", async () => {
      const token = await TestUtility.getTokenByEmailAndLogin(
        "kaitopia-admin+001@kaitopia.com",
        "password",
      )
      const request = new NextRequest(
        "http://localhost:3000/api/manage/v1/exercise?schoolId=kaitopia_1&count=1&page=1",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      const result = await GET(request)

      expect(result.ok).toBe(true)
      expect(result.status).toBe(200)
      const json = await result.json()
      expect(json.success).toEqual(true)
      expect(json.data).toBeDefined()
      expect(json.data.exercises).toBeDefined()
      expect(Array.isArray(json.data.exercises)).toBe(true)
      expect(json.data.exercises.length).toBeGreaterThan(0)
    })

    test("USERユーザ グローバルスクールに所属する問題集へのアクセス", async () => {
      const token = await TestUtility.getTokenByEmailAndLogin(
        "kaitopia-user+001@kaitopia.com",
        "password",
      )
      const request = new NextRequest(
        "http://localhost:3000/api/manage/v1/exercise?schoolId=kaitopia_1&count=1&page=1",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      const result = await GET(request)

      expect(result.ok).toBe(false)
      expect(result.status).toBe(403)
      const json = await result.json()
      expect(json).toEqual({
        success: false,
        errors: expect.arrayContaining([
          {
            code: "RoleTypeError",
            message: "アクセス権限がありません",
          },
        ]),
      })
    })
  })
})
