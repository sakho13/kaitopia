/**
 * @jest-environment node
 */

import { GET } from "@/app/api/manage/v1/users/route"
import { TestUtility } from "@/tests/TestUtility"
import { NextRequest } from "next/server"

describe("API /api/manage/v1/users", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("アクセス権限チェック", () => {
    test("ADMINユーザ 全ユーザが取得できる", async () => {
      const token = await TestUtility.getTokenByEmailAndLogin(
        "kaitopia-admin+001@kaitopia.com",
        "password",
      )
      const request = new NextRequest(
        "http://localhost:3000/api/manage/v1/users?schoolId=kaitopia_1&count=1&page=1",
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
      expect(json.data.users).toBeDefined()
      expect(Array.isArray(json.data.users)).toBe(true)
      expect(json.data.users.length).toBeGreaterThan(0)
    })

    test("USERユーザ 権限不足で取得ができない", async () => {
      const token = await TestUtility.getTokenByEmailAndLogin(
        "kaitopia-user+001@kaitopia.com",
        "password",
      )
      const request = new NextRequest(
        "http://localhost:3000/api/manage/v1/users?count=1&page=1",
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
