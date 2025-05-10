/**
 * @jest-environment node
 */

import { POST } from "@/app/api/user/v1/login/route"
import { GET as UserConfigGET } from "@/app/api/user/v1/user-config/route"
import { DateUtility } from "@/lib/classes/common/DateUtility"
import { generateRandomLenNumber } from "@/lib/functions/generateRandomLenNumber"
import { TestUtility } from "@/tests/TestUtility"
import { NextRequest } from "next/server"

describe("API /api/user/v1/login/", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("既存のユーザでログイン", async () => {
    const token = await TestUtility.getTokenByEmailAndLogin(
      "kaitopia-user+001@kaitopia.com",
      "password",
    )
    const request = new NextRequest("http://localhost:3000/api/user/v1/login", {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const result = await POST(request)

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
    const request = new NextRequest("http://localhost:3000/api/user/v1/login", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const result = await POST(request)

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
