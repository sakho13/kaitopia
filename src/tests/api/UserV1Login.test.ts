/**
 * @jest-environment node
 */

import { POST } from "@/app/api/user/v1/login/route"
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
        state: "register",
        isGuest: false,
      }),
    })
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
  })
})
