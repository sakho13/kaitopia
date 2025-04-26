/**
 * @jest-environment node
 */

import { DELETE, GET, POST } from "@/app/api/manage/v1/exercise/route"
import { DateUtility } from "@/lib/classes/common/DateUtility"
import { TestUtility } from "@/tests/TestUtility"

const AdminUserEmail = "kaitopia-admin+001@kaitopia.com"
const AdminUserPassword = "password"
const UserUserEmail = "kaitopia-user+001@kaitopia.com"
const UserUserPassword = "password"

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
        const result = await TestUtility.runApi(
          GET,
          "GET",
          "/api/manage/v1/exercise?exerciseId=it_passport_1",
          {
            Authorization: `Bearer ${token}`,
          },
        )

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
        const result = await TestUtility.runApi(
          GET,
          "GET",
          "/api/manage/v1/exercise?exerciseId=it_passport_1",
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
        const result = await TestUtility.runApi(
          POST,
          "POST",
          "/api/manage/v1/exercise",
          {
            Authorization: `Bearer ${token}`,
          },
          {
            schoolId: "kaitopia_1",
            property: {
              title: exerciseTitle,
              description: "",
            },
          },
        )

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
        const result = await TestUtility.runApi(
          POST,
          "POST",
          "/api/manage/v1/exercise",
          {
            Authorization: `Bearer ${token}`,
          },
          {
            schoolId: "kaitopia_1",
            property: {
              title: exerciseTitle,
              description: "",
            },
          },
        )

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

    test("ADMINユーザがグローバルスクールに問題集を追加し、削除できる", async () => {
      const token = await TestUtility.getTokenByEmailAndLogin(
        AdminUserEmail,
        AdminUserPassword,
      )

      const exerciseTitle = `テスト問題集-${DateUtility.generateDateStringNow()}`
      const postResult = await TestUtility.runApi(
        POST,
        "POST",
        "/api/manage/v1/exercise",
        {
          Authorization: `Bearer ${token}`,
        },
        {
          schoolId: "kaitopia_1",
          property: {
            title: exerciseTitle,
            description: "",
          },
        },
      )

      expect(postResult.ok).toBe(true)
      expect(postResult.status).toBe(200)
      const data = await postResult.json()
      expect(data.success).toBe(true)

      const deleteResult = await TestUtility.runApi(
        DELETE,
        "DELETE",
        `/api/manage/v1/exercise?exerciseId=${data.data.exercise.exerciseId}`,
        {
          Authorization: `Bearer ${token}`,
        },
      )

      expect(deleteResult.ok).toBe(true)
      expect(deleteResult.status).toBe(200)
      const deleteJson = await deleteResult.json()
      expect(deleteJson).toEqual({
        success: true,
        data: expect.objectContaining({
          exerciseId: data.data.exercise.exerciseId,
        }),
      })

      const checkResult = await TestUtility.runApi(
        GET,
        "GET",
        `/api/manage/v1/exercise?exerciseId=${data.data.exercise.exerciseId}`,
        {
          Authorization: `Bearer ${token}`,
        },
      )
      expect(checkResult.ok).toBe(false)
      expect(checkResult.status).toBe(404)
    })

    test("USERユーザがグローバルスクールの問題集を削除できない", async () => {
      const token = await TestUtility.getTokenByEmailAndLogin(
        UserUserEmail,
        UserUserPassword,
      )

      const deleteResult = await TestUtility.runApi(
        DELETE,
        "DELETE",
        `/api/manage/v1/exercise?exerciseId=intro_programming_1`,
        {
          Authorization: `Bearer ${token}`,
        },
      )

      expect(deleteResult.ok).toBe(false)
      expect(deleteResult.status).toBe(403)
      const deleteJson = await deleteResult.json()
      expect(deleteJson).toEqual({
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
