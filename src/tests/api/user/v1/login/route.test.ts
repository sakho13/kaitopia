/**
 * @jest-environment node
 */

import { POST } from "@/app/api/user/v1/login/route"
import { GET as UserConfigGET } from "@/app/api/user/v1/user-config/route"
import { GET as UserInfoGET } from "@/app/api/user/v1/info/route"
import { DateUtility } from "@/lib/classes/common/DateUtility"
import { generateRandomLenNumber } from "@/lib/functions/generateRandomLenNumber"
import { TestUtility } from "@/tests/TestUtility"

describe("API /api/user/v1/login/", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("既存のユーザでログイン", async () => {
    const token = await TestUtility.getTokenByEmailAndLogin(
      "kaitopia-user+001@kaitopia.com",
      "password",
    )
    const result = await TestUtility.runApi(
      POST,
      "POST",
      "/api/user/v1/login",
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
        state: "login",
        isGuest: false,
      }),
    })

    const resultUserInfo = await TestUtility.runApi(
      UserInfoGET,
      "GET",
      "/api/user/v1/info",
      {
        Authorization: `Bearer ${token}`,
      },
    )

    expect(resultUserInfo.ok).toBe(true)
    expect(resultUserInfo.status).toBe(200)
    const jsonUserInfo = await resultUserInfo.json()

    expect(jsonUserInfo.success).toBe(true)
    expect(jsonUserInfo.data).toBeDefined()
    expect(jsonUserInfo.data.schools).toHaveLength(2)
    expect(jsonUserInfo.data.schools).toEqual(
      expect.arrayContaining([
        {
          schoolId: expect.any(String),
          schoolName: expect.any(String),
        },
        {
          schoolId: "kaitopia_1",
          schoolName: "Kaitopia",
        },
      ])
    )
  })

  test("新規ユーザでサインアップ", async () => {
    const token = await TestUtility.getTokenByEmailAndSignUp(
      `test-user-${DateUtility.generateDateStringNow()}+${generateRandomLenNumber(
        3,
      )}@kaitopia.com`,
      "password",
    )
    expect(token).toBeDefined()

    const result = await TestUtility.runApi(
      POST,
      "POST",
      "/api/user/v1/login",
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
        state: "register",
        isGuest: false,
      }),
    })

    const resultUserConfig = await TestUtility.runApi(
      UserConfigGET,
      "GET",
      "/api/user/v1/user-config",
      {
        Authorization: `Bearer ${token}`,
      },
    )

    expect(resultUserConfig.ok).toBe(true)
    expect(resultUserConfig.status).toBe(200)
    const jsonUserConfig = await resultUserConfig.json()

    expect(jsonUserConfig.success).toBe(true)
    expect(jsonUserConfig.data).toBeDefined()
    expect(jsonUserConfig.data.userInfo).toBeDefined()
    expect(jsonUserConfig.data.schools).toBeDefined()
    expect(Array.isArray(jsonUserConfig.data.schools)).toBe(true)
    expect(jsonUserConfig.data.schools).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          isSelfSchool: true,
          isGlobal: false,
          isPublic: false,
        }),
      ]),
    )
  })

  test("ゲストユーザでログイン", async () => {
    const token = await TestUtility.getGuestToken()

    const result = await TestUtility.runApi(
      POST,
      "POST",
      "/api/user/v1/login",
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
        state: "register",
        isGuest: true,
      }),
    })

    // user-configを取得
    const resultGetUserConfig = await TestUtility.runApi(
      UserConfigGET,
      "GET",
      "/api/user/v1/user-config",
      {
        Authorization: `Bearer ${token}`,
      },
    )
    expect(resultGetUserConfig.ok).toBe(true)
    expect(resultGetUserConfig.status).toBe(200)
    const jsonGetUserConfig = await resultGetUserConfig.json()
    expect(jsonGetUserConfig.success).toBe(true)
  })
})
