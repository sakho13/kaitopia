/**
 * @jest-environment node
 */

import {
  GET,
  POST,
} from "@/app/api/manage/v1/certification-requests/route"
import { POST as POST_VOTE } from "@/app/api/manage/v1/certification-requests/vote/route"
import { TestUtility } from "@/tests/TestUtility"

const AdminUserEmail = "kaitopia-admin+001@kaitopia.com"
const AdminUserPassword = "password"
const ModeratorUserEmail = "kaitopia-moderator+001@kaitopia.com"
const ModeratorUserPassword = "password"
const UserUserEmail = "kaitopia-user+001@kaitopia.com"
const UserUserPassword = "password"

describe("API /api/manage/v1/certification-requests", () => {
  let adminToken = ""
  let moderatorToken = ""
  let userToken = ""

  beforeAll(async () => {
    adminToken = await TestUtility.getTokenByEmailAndLogin(
      AdminUserEmail,
      AdminUserPassword,
    )
    moderatorToken = await TestUtility.getTokenByEmailAndLogin(
      ModeratorUserEmail,
      ModeratorUserPassword,
    )
    userToken = await TestUtility.getTokenByEmailAndLogin(
      UserUserEmail,
      UserUserPassword,
    )
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    adminToken = ""
    moderatorToken = ""
    userToken = ""
  })

  describe("GET - 資格リクエスト一覧取得", () => {
    test("ADMINユーザ 資格リクエスト一覧を取得できる", async () => {
      const result = await TestUtility.runApi(
        GET,
        "GET",
        "/api/manage/v1/certification-requests?page=1&count=10",
        { Authorization: `Bearer ${adminToken}` },
      )
      expect(result.ok).toBe(true)
      expect(result.status).toBe(200)
      const json = await result.json()
      expect(json.success).toBe(true)
      expect(json.data).toBeDefined()
      expect(json.data.requests).toBeDefined()
      expect(Array.isArray(json.data.requests)).toBe(true)
      expect(json.data.totalCount).toBeDefined()
    })

    test("MODERATORユーザ 資格リクエスト一覧を取得できる", async () => {
      const result = await TestUtility.runApi(
        GET,
        "GET",
        "/api/manage/v1/certification-requests?page=1&count=10",
        { Authorization: `Bearer ${moderatorToken}` },
      )
      expect(result.ok).toBe(true)
      expect(result.status).toBe(200)
      const json = await result.json()
      expect(json.success).toBe(true)
      expect(json.data.requests).toBeDefined()
    })

    test("USERユーザ 資格リクエスト一覧を取得できない", async () => {
      const result = await TestUtility.runApi(
        GET,
        "GET",
        "/api/manage/v1/certification-requests?page=1&count=10",
        { Authorization: `Bearer ${userToken}` },
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

  describe("POST - 資格リクエスト作成", () => {
    test("MODERATORユーザ 資格リクエストを作成できる", async () => {
      const result = await TestUtility.runApi(
        POST,
        "POST",
        "/api/manage/v1/certification-requests",
        { Authorization: `Bearer ${moderatorToken}` },
        {
          name: "リクエストテスト資格" + Date.now(),
          description: "リクエストテスト用の資格です",
        },
      )
      expect(result.ok).toBe(true)
      expect(result.status).toBe(200)
      const json = await result.json()
      expect(json.success).toBe(true)
      expect(json.data).toBeDefined()
      expect(json.data.id).toBeDefined()
      expect(json.data.requestedName).toContain("リクエストテスト資格")
      expect(json.data.requestedDescription).toBe("リクエストテスト用の資格です")
      expect(json.data.status).toBe("PENDING")
      expect(json.data.createdAt).toBeIsoUtcString()
      expect(json.data.updatedAt).toBeIsoUtcString()
    })

    test("ADMINユーザ 資格リクエストを作成できる", async () => {
      const result = await TestUtility.runApi(
        POST,
        "POST",
        "/api/manage/v1/certification-requests",
        { Authorization: `Bearer ${adminToken}` },
        {
          name: "管理者リクエストテスト資格" + Date.now(),
          description: "管理者リクエストテスト用の資格です",
        },
      )
      expect(result.ok).toBe(true)
      expect(result.status).toBe(200)
      const json = await result.json()
      expect(json.success).toBe(true)
      expect(json.data.status).toBe("PENDING")
    })

    test("USERユーザ 資格リクエストを作成できない", async () => {
      const result = await TestUtility.runApi(
        POST,
        "POST",
        "/api/manage/v1/certification-requests",
        { Authorization: `Bearer ${userToken}` },
        {
          name: "テスト資格",
          description: "テスト用の資格です",
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

    test("MODERATORユーザ 資格名が空の場合エラー", async () => {
      const result = await TestUtility.runApi(
        POST,
        "POST",
        "/api/manage/v1/certification-requests",
        { Authorization: `Bearer ${moderatorToken}` },
        {
          name: "",
          description: "テスト用の資格です",
        },
      )
      expect(result.ok).toBe(false)
      expect(result.status).toBe(400)
      const json = await result.json()
      expect(json.success).toBe(false)
      expect(json.errors).toBeDefined()
    })
  })

  describe("POST - 資格リクエストに投票", () => {
    let requestId = ""

    beforeEach(async () => {
      // テスト用のリクエストを作成
      const createResult = await TestUtility.runApi(
        POST,
        "POST",
        "/api/manage/v1/certification-requests",
        { Authorization: `Bearer ${moderatorToken}` },
        {
          name: "投票テスト資格" + Date.now(),
          description: "投票テスト用の資格です",
        },
      )
      const createJson = await createResult.json()
      requestId = createJson.data.id
    })

    test("ADMINユーザ リクエストに投票できる", async () => {
      const result = await TestUtility.runApi(
        POST_VOTE,
        "POST",
        "/api/manage/v1/certification-requests/vote",
        { Authorization: `Bearer ${adminToken}` },
        {
          requestId,
        },
      )
      expect(result.ok).toBe(true)
      expect(result.status).toBe(200)
      const json = await result.json()
      expect(json.success).toBe(true)
      expect(json.data).toBeDefined()
      expect(json.data.id).toBeDefined()
      expect(json.data.requestId).toBe(requestId)
      expect(json.data.userId).toBeDefined()
      expect(json.data.createdAt).toBeIsoUtcString()
    })

    test("MODERATORユーザ リクエストに投票できる", async () => {
      const result = await TestUtility.runApi(
        POST_VOTE,
        "POST",
        "/api/manage/v1/certification-requests/vote",
        { Authorization: `Bearer ${moderatorToken}` },
        {
          requestId,
        },
      )
      expect(result.ok).toBe(true)
      expect(result.status).toBe(200)
    })

    test("USERユーザ リクエストに投票できない", async () => {
      const result = await TestUtility.runApi(
        POST_VOTE,
        "POST",
        "/api/manage/v1/certification-requests/vote",
        { Authorization: `Bearer ${userToken}` },
        {
          requestId,
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

    test("ADMINユーザ 同じリクエストに二重投票できない", async () => {
      // 最初の投票
      await TestUtility.runApi(
        POST_VOTE,
        "POST",
        "/api/manage/v1/certification-requests/vote",
        { Authorization: `Bearer ${adminToken}` },
        {
          requestId,
        },
      )

      // 二回目の投票
      const result = await TestUtility.runApi(
        POST_VOTE,
        "POST",
        "/api/manage/v1/certification-requests/vote",
        { Authorization: `Bearer ${adminToken}` },
        {
          requestId,
        },
      )
      expect(result.ok).toBe(false)
      expect(result.status).toBe(409)
      const json = await result.json()
      expect(json.success).toBe(false)
      expect(json.errors).toBeDefined()
    })

    test("ADMINユーザ 存在しないリクエストIDで投票しようとするとエラー", async () => {
      const result = await TestUtility.runApi(
        POST_VOTE,
        "POST",
        "/api/manage/v1/certification-requests/vote",
        { Authorization: `Bearer ${adminToken}` },
        {
          requestId: "invalid-request-id",
        },
      )
      expect(result.ok).toBe(false)
      expect(result.status).toBe(404)
      const json = await result.json()
      expect(json.success).toBe(false)
      expect(json.errors).toBeDefined()
    })
  })
})
