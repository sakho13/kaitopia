/**
 * @jest-environment node
 */

import { GET } from "@/app/api/manage/v1/exercise/route"
import { TestUtility } from "@/tests/TestUtility"
import { NextRequest } from "next/server"

describe("API /api/manage/v1/exercise", () => {
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
        "http://localhost:3000/api/manage/v1/exercise?exerciseId=it_passport_1",
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
      expect(json).toEqual({
        success: true,
        data: expect.objectContaining({
          exercise: expect.objectContaining({
            exerciseId: "it_passport_1",
          }),
        }),
      })
    })

    test("USERユーザ グローバルスクールに所属する問題集へのアクセス", async () => {
      const token = await TestUtility.getTokenByEmailAndLogin(
        "kaitopia-user+001@kaitopia.com",
        "password",
      )
      const request = new NextRequest(
        "http://localhost:3000/api/manage/v1/exercise?exerciseId=it_passport_1",
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
            message: "アクセス権限がありません",
          },
        ]),
      })
    })
  })
})
