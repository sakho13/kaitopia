/**
 * @jest-environment node
 */

import { GET, POST } from "@/app/api/manage/v1/exercise/route"
import { DateUtility } from "@/lib/classes/common/DateUtility"
import { TestUtility } from "@/tests/TestUtility"
import { NextRequest } from "next/server"

describe("API /api/manage/v1/exercise", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("アクセス権限チェック", () => {
    describe("GET", () => {
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

    describe("POST", () => {
      test("ADMINユーザがグローバルスクールに問題集を追加できる", async () => {
        const token = await TestUtility.getTokenByEmailAndLogin(
          "kaitopia-admin+001@kaitopia.com",
          "password",
        )
        const exerciseTitle = `テスト問題集-${DateUtility.generateDateStringNow()}`
        const request = new NextRequest(
          "http://localhost:3000/api/manage/v1/exercise",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              schoolId: "kaitopia_1",
              property: {
                title: exerciseTitle,
                description: "",
              },
            }),
          },
        )
        const result = await POST(request)

        expect(result.ok).toBe(true)
        expect(result.status).toBe(200)
        const json = await result.json()
        expect(json).toEqual({
          success: true,
          data: expect.objectContaining({
            exercise: expect.objectContaining({
              title: exerciseTitle,
            }),
          }),
        })
      })

      test("USERユーザがグローバルスクールに問題集を追加できない", async () => {
        const token = await TestUtility.getTokenByEmailAndLogin(
          "kaitopia-user+001@kaitopia.com",
          "password",
        )
        const exerciseTitle = `テスト問題集-${DateUtility.generateDateStringNow()}`
        const request = new NextRequest(
          "http://localhost:3000/api/manage/v1/exercise",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              schoolId: "kaitopia_1",
              property: {
                title: exerciseTitle,
                description: "",
              },
            }),
          },
        )
        const result = await POST(request)

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
})
