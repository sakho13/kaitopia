/**
 * @jest-environment node
 */

import { GET, PATCH } from "@/app/api/user/v1/info/route"
import { TestUtility } from "@/tests/TestUtility"

describe("API /api/user/v1/info", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("CRUD", () => {
    test("名前を個別編集できること", async () => {
      const token = await TestUtility.getGuestToken()
      const registerResult = await TestUtility.signUpByToken(token)
      expect(registerResult.ok).toBe(true)

      const beforeUserInfo = await TestUtility.runApi(
        GET,
        "GET",
        "/api/user/v1/user/info",
        {
          Authorization: `Bearer ${token}`,
        },
      )
      expect(beforeUserInfo.ok).toBe(true)
      expect(beforeUserInfo.status).toBe(200)
      const jsonBeforeUserInfo = await beforeUserInfo.json()

      const editResult = await TestUtility.runApi(
        PATCH,
        "PATCH",
        "/api/user/v1/user/info",
        {
          Authorization: `Bearer ${token}`,
        },
        {
          user: {
            name: "new name",
          },
        },
      )
      expect(editResult.ok).toBe(true)
      expect(editResult.status).toBe(200)
      const jsonEditResult = await editResult.json()
      expect(jsonEditResult.data.user.name).toBe("new name")

      const afterUserInfo = await TestUtility.runApi(
        GET,
        "GET",
        "/api/user/v1/user/info",
        {
          Authorization: `Bearer ${token}`,
        },
      )
      expect(afterUserInfo.ok).toBe(true)
      expect(afterUserInfo.status).toBe(200)
      const jsonAfterUserInfo = await afterUserInfo.json()
      expect(jsonAfterUserInfo.data.user.name).toBe("new name")
      expect(jsonAfterUserInfo.data.user.birthDayDate).toBe(
        jsonBeforeUserInfo.data.user.birthDayDate,
      )
      expect(jsonAfterUserInfo.data.user.email).toBe(
        jsonBeforeUserInfo.data.user.email,
      )
      expect(jsonAfterUserInfo.data.user.phoneNumber).toBe(
        jsonBeforeUserInfo.data.user.phoneNumber,
      )
      expect(jsonAfterUserInfo.data.user.role).toBe(
        jsonBeforeUserInfo.data.user.role,
      )
      expect(jsonAfterUserInfo.data.user.createdAt).toBe(
        jsonBeforeUserInfo.data.user.createdAt,
      )
      expect(jsonAfterUserInfo.data.user.updatedAt).not.toBe(
        jsonBeforeUserInfo.data.user.updatedAt,
      )
    })

    test("生年月日を個別編集できること", async () => {
      const token = await TestUtility.getGuestToken()
      const registerResult = await TestUtility.signUpByToken(token)
      expect(registerResult.ok).toBe(true)

      const beforeUserInfo = await TestUtility.runApi(
        GET,
        "GET",
        "/api/user/v1/user/info",
        {
          Authorization: `Bearer ${token}`,
        },
      )
      expect(beforeUserInfo.ok).toBe(true)
      expect(beforeUserInfo.status).toBe(200)
      const jsonBeforeUserInfo = await beforeUserInfo.json()

      const editResult = await TestUtility.runApi(
        PATCH,
        "PATCH",
        "/api/user/v1/user/info",
        {
          Authorization: `Bearer ${token}`,
        },
        {
          user: {
            birthDayDate: "2000-01-01T00:00:00.000+09:00",
          },
        },
      )
      expect(editResult.ok).toBe(true)
      expect(editResult.status).toBe(200)
      const jsonEditResult = await editResult.json()
      expect(jsonEditResult.data.user.birthDayDate).toBe(
        "1999-12-31T15:00:00.000Z", // UTCの日時で取得される
      )

      const afterUserInfo = await TestUtility.runApi(
        GET,
        "GET",
        "/api/user/v1/user/info",
        {
          Authorization: `Bearer ${token}`,
        },
      )
      expect(afterUserInfo.ok).toBe(true)
      expect(afterUserInfo.status).toBe(200)
      const jsonAfterUserInfo = await afterUserInfo.json()
      expect(jsonAfterUserInfo.data.user.name).toBe(
        jsonBeforeUserInfo.data.user.name,
      )
      expect(jsonAfterUserInfo.data.user.birthDayDate).toBe(
        "1999-12-31T15:00:00.000Z", // UTCの日時で取得される
      )
      expect(jsonAfterUserInfo.data.user.email).toBe(
        jsonBeforeUserInfo.data.user.email,
      )
      expect(jsonAfterUserInfo.data.user.phoneNumber).toBe(
        jsonBeforeUserInfo.data.user.phoneNumber,
      )
      expect(jsonAfterUserInfo.data.user.role).toBe(
        jsonBeforeUserInfo.data.user.role,
      )
      expect(jsonAfterUserInfo.data.user.createdAt).toBe(
        jsonBeforeUserInfo.data.user.createdAt,
      )
      expect(jsonAfterUserInfo.data.user.updatedAt).not.toBe(
        jsonBeforeUserInfo.data.user.updatedAt,
      )
    })

    test("すべての項目を一括で編集できること", async () => {
      const token = await TestUtility.getGuestToken()
      const registerResult = await TestUtility.signUpByToken(token)
      expect(registerResult.ok).toBe(true)

      const beforeUserInfo = await TestUtility.runApi(
        GET,
        "GET",
        "/api/user/v1/user/info",
        {
          Authorization: `Bearer ${token}`,
        },
      )
      expect(beforeUserInfo.ok).toBe(true)
      expect(beforeUserInfo.status).toBe(200)
      const jsonBeforeUserInfo = await beforeUserInfo.json()

      const editResult = await TestUtility.runApi(
        PATCH,
        "PATCH",
        "/api/user/v1/user/info",
        {
          Authorization: `Bearer ${token}`,
        },
        {
          user: {
            name: "new name",
            birthDayDate: "2000-01-01T00:00:00.000+09:00",
          },
        },
      )
      expect(editResult.ok).toBe(true)
      expect(editResult.status).toBe(200)
      const jsonEditResult = await editResult.json()
      expect(jsonEditResult.data.user.name).toBe("new name")
      expect(jsonEditResult.data.user.birthDayDate).toBe(
        "1999-12-31T15:00:00.000Z", // UTCの日時で取得される
      )

      const afterUserInfo = await TestUtility.runApi(
        GET,
        "GET",
        "/api/user/v1/user/info",
        {
          Authorization: `Bearer ${token}`,
        },
      )
      expect(afterUserInfo.ok).toBe(true)
      expect(afterUserInfo.status).toBe(200)
      const jsonAfterUserInfo = await afterUserInfo.json()
      expect(jsonAfterUserInfo.data.user.name).toBe("new name")
      expect(jsonAfterUserInfo.data.user.birthDayDate).toBe(
        "1999-12-31T15:00:00.000Z", // UTCの日時で取得される
      )
      expect(jsonAfterUserInfo.data.user.email).toBe(
        jsonBeforeUserInfo.data.user.email,
      )
      expect(jsonAfterUserInfo.data.user.phoneNumber).toBe(
        jsonBeforeUserInfo.data.user.phoneNumber,
      )
      expect(jsonAfterUserInfo.data.user.role).toBe(
        jsonBeforeUserInfo.data.user.role,
      )
      expect(jsonAfterUserInfo.data.user.createdAt).toBe(
        jsonBeforeUserInfo.data.user.createdAt,
      )
      expect(jsonAfterUserInfo.data.user.updatedAt).not.toBe(
        jsonBeforeUserInfo.data.user.updatedAt,
      )
    })
  })

  describe("バリデーション", () => {
    let token = ""
    beforeAll(async () => {
      const guestToken = await TestUtility.getGuestToken()
      const result = await TestUtility.signUpByToken(guestToken)
      expect(result.ok).toBe(true)
      token = guestToken
      expect(token).not.toBe("")
    })

    describe("PATCH", () => {
      test("リクエストボディが空", async () => {
        const result = await TestUtility.runApi(
          PATCH,
          "PATCH",
          "/api/user/v1/user/info",
          {
            Authorization: `Bearer ${token}`,
          },
          {},
        )
        expect(result.ok).toBe(false)
        expect(result.status).toBe(400)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: [
            {
              code: "RequiredValueError",
              message: "編集項目は必須です",
            },
          ],
        })
      })

      test("編集項目が空", async () => {
        const result = await TestUtility.runApi(
          PATCH,
          "PATCH",
          "/api/user/v1/user/info",
          {
            Authorization: `Bearer ${token}`,
          },
          {
            user: {},
          },
        )
        expect(result.ok).toBe(false)
        expect(result.status).toBe(400)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: [
            {
              code: "RequiredValueError",
              message: "編集項目は必須です",
              columnName: "user",
            },
          ],
        })
      })

      test("名前が空", async () => {
        const result = await TestUtility.runApi(
          PATCH,
          "PATCH",
          "/api/user/v1/user/info",
          {
            Authorization: `Bearer ${token}`,
          },
          {
            user: {
              name: "",
            },
          },
        )
        expect(result.ok).toBe(false)
        expect(result.status).toBe(400)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: [
            {
              code: "InvalidFormatError",
              message: "名前の形式が不正です",
              columnName: "name",
            },
          ],
        })
      })

      test("名前が長すぎる", async () => {
        const result = await TestUtility.runApi(
          PATCH,
          "PATCH",
          "/api/user/v1/user/info",
          {
            Authorization: `Bearer ${token}`,
          },
          {
            user: {
              name: "a".repeat(101), // 101文字
            },
          },
        )
        expect(result.ok).toBe(false)
        expect(result.status).toBe(400)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: [
            {
              code: "InvalidFormatError",
              message: "名前の形式が不正です",
              columnName: "name",
            },
          ],
        })
      })

      test("生年月日が空", async () => {
        const result = await TestUtility.runApi(
          PATCH,
          "PATCH",
          "/api/user/v1/user/info",
          {
            Authorization: `Bearer ${token}`,
          },
          {
            user: {
              birthDayDate: "",
            },
          },
        )
        expect(result.ok).toBe(false)
        expect(result.status).toBe(400)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: [
            {
              code: "InvalidFormatError",
              message: "生年月日の形式が不正です",
              columnName: "birthDayDate",
            },
          ],
        })
      })

      test("生年月日が不正な形式", async () => {
        const result = await TestUtility.runApi(
          PATCH,
          "PATCH",
          "/api/user/v1/user/info",
          {
            Authorization: `Bearer ${token}`,
          },
          {
            user: {
              birthDayDate: "invalid-date",
            },
          },
        )
        expect(result.ok).toBe(false)
        expect(result.status).toBe(400)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: [
            {
              code: "InvalidFormatError",
              message: "生年月日の形式が不正です",
              columnName: "birthDayDate",
            },
          ],
        })
      })
    })
  })
})
