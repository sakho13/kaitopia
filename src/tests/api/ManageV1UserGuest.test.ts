/**
 * @jest-environment node
 */

import { DELETE } from "@/app/api/manage/v1/user/guest/route"
import { TestUtility } from "@/tests/TestUtility"
import { NextRequest } from "next/server"

describe("API /api/manage/v1/user/guest", () => {
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
        "http://localhost:3000/api/manage/v1/user/guest",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      const result = await DELETE(request)

      expect(result.ok).toBe(true)
      expect(result.status).toBe(200)
      const json = await result.json()
      expect(json.success).toEqual(true)
      expect(json.data).toBeDefined()
      expect(json.data).toEqual(
        expect.objectContaining({
          deletedUserCount: expect.any(Number),
          deletedUserIds: expect.any(Array),
        }),
      )
    })

    test("USERユーザ 権限不足で削除できない", async () => {
      const token = await TestUtility.getTokenByEmailAndLogin(
        "kaitopia-user+001@kaitopia.com",
        "password",
      )
      const request = new NextRequest(
        "http://localhost:3000/api/manage/v1/user/guest",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      const result = await DELETE(request)

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
