/**
 * @jest-environment node
 */

import { GET } from "@/app/api/manage/v1/dashboard/route"
import { TestUtility } from "@/tests/TestUtility"

const AdminUserEmail = "kaitopia-admin+001@kaitopia.com"
const AdminUserPassword = "password"
const UserUserEmail = "kaitopia-user+001@kaitopia.com"
const UserUserPassword = "password"

describe("API /api/manage/v1/dashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("アクセス権限チェック", () => {
    describe("GET", () => {
      test("ADMINユーザ", async () => {
        const token = await TestUtility.getTokenByEmailAndLogin(
          AdminUserEmail,
          AdminUserPassword,
        )
        const result = await TestUtility.runApi(
          GET,
          "GET",
          "/api/manage/v1/dashboard",
          {
            Authorization: `Bearer ${token}`,
          },
        )

        expect(result.ok).toBe(true)
        expect(result.status).toBe(200)
        const json = await result.json()
        expect(json).toEqual({
          success: true,
          data: {
            totalActiveGuestUserCount: expect.any(Number),
            totalActiveUserCount: expect.any(Number),
            totalUserCount: expect.any(Number),
            totalQuestionCount: expect.any(Number),
            totalExerciseCount: expect.any(Number),
          },
        })
      })

      test("USERユーザ アクセス不可", async () => {
        const token = await TestUtility.getTokenByEmailAndLogin(
          UserUserEmail,
          UserUserPassword,
        )
        const result = await TestUtility.runApi(
          GET,
          "GET",
          "/api/manage/v1/dashboard",
          {
            Authorization: `Bearer ${token}`,
          },
        )

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

  describe("バリデーション", () => {
    describe("GET", () => {})
  })

  describe("CRUD", () => {})
})
