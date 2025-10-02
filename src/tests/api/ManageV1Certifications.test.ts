/**
 * @jest-environment node
 */

import {
  GET,
  POST,
  PATCH,
  DELETE,
} from "@/app/api/manage/v1/certifications/route"
import { TestUtility } from "@/tests/TestUtility"

const AdminUserEmail = "kaitopia-admin+001@kaitopia.com"
const AdminUserPassword = "password"
const UserUserEmail = "kaitopia-user+001@kaitopia.com"
const UserUserPassword = "password"

describe("API /api/manage/v1/certifications", () => {
  let adminToken = ""
  let userToken = ""

  beforeAll(async () => {
    adminToken = await TestUtility.getTokenByEmailAndLogin(
      AdminUserEmail,
      AdminUserPassword,
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
    userToken = ""
  })

  describe("CRUD", () => {
    describe("GET - 資格一覧取得", () => {
      test("ADMINユーザ 資格一覧を取得できる", async () => {
        const result = await TestUtility.runApi(
          GET,
          "GET",
          "/api/manage/v1/certifications?page=1&count=10",
          { Authorization: `Bearer ${adminToken}` },
        )
        expect(result.ok).toBe(true)
        expect(result.status).toBe(200)
        const json = await result.json()
        expect(json.success).toBe(true)
        expect(json.data).toBeDefined()
        expect(json.data.certifications).toBeDefined()
        expect(Array.isArray(json.data.certifications)).toBe(true)
        expect(json.data.totalCount).toBeDefined()
      })

      test("USERユーザ 資格一覧を取得できない", async () => {
        const result = await TestUtility.runApi(
          GET,
          "GET",
          "/api/manage/v1/certifications?page=1&count=10",
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

    describe("POST - 資格作成", () => {
      test("ADMINユーザ 資格を作成できる", async () => {
        const result = await TestUtility.runApi(
          POST,
          "POST",
          "/api/manage/v1/certifications",
          { Authorization: `Bearer ${adminToken}` },
          {
            name: "テスト資格" + Date.now(),
            description: "テスト用の資格です",
          },
        )
        expect(result.ok).toBe(true)
        expect(result.status).toBe(200)
        const json = await result.json()
        expect(json.success).toBe(true)
        expect(json.data).toBeDefined()
        expect(json.data.id).toBeDefined()
        expect(json.data.name).toContain("テスト資格")
        expect(json.data.description).toBe("テスト用の資格です")
        expect(json.data.createdAt).toBeIsoUtcString()
        expect(json.data.updatedAt).toBeIsoUtcString()
      })

      test("USERユーザ 資格を作成できない", async () => {
        const result = await TestUtility.runApi(
          POST,
          "POST",
          "/api/manage/v1/certifications",
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

      test("ADMINユーザ 資格名が空の場合エラー", async () => {
        const result = await TestUtility.runApi(
          POST,
          "POST",
          "/api/manage/v1/certifications",
          { Authorization: `Bearer ${adminToken}` },
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

      test("ADMINユーザ 資格説明が空の場合エラー", async () => {
        const result = await TestUtility.runApi(
          POST,
          "POST",
          "/api/manage/v1/certifications",
          { Authorization: `Bearer ${adminToken}` },
          {
            name: "テスト資格",
            description: "",
          },
        )
        expect(result.ok).toBe(false)
        expect(result.status).toBe(400)
        const json = await result.json()
        expect(json.success).toBe(false)
        expect(json.errors).toBeDefined()
      })
    })

    describe("PATCH - 資格更新", () => {
      let certificationId = ""

      beforeEach(async () => {
        // テスト用の資格を作成
        const createResult = await TestUtility.runApi(
          POST,
          "POST",
          "/api/manage/v1/certifications",
          { Authorization: `Bearer ${adminToken}` },
          {
            name: "更新テスト資格" + Date.now(),
            description: "更新前の説明",
          },
        )
        const createJson = await createResult.json()
        certificationId = createJson.data.id
      })

      test("ADMINユーザ 資格を更新できる", async () => {
        const result = await TestUtility.runApi(
          PATCH,
          "PATCH",
          "/api/manage/v1/certifications",
          { Authorization: `Bearer ${adminToken}` },
          {
            id: certificationId,
            name: "更新後の資格名",
            description: "更新後の説明",
          },
        )
        expect(result.ok).toBe(true)
        expect(result.status).toBe(200)
        const json = await result.json()
        expect(json.success).toBe(true)
        expect(json.data.id).toBe(certificationId)
        expect(json.data.name).toBe("更新後の資格名")
        expect(json.data.description).toBe("更新後の説明")
      })

      test("USERユーザ 資格を更新できない", async () => {
        const result = await TestUtility.runApi(
          PATCH,
          "PATCH",
          "/api/manage/v1/certifications",
          { Authorization: `Bearer ${userToken}` },
          {
            id: certificationId,
            name: "更新後の資格名",
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

    describe("DELETE - 資格削除", () => {
      let certificationId = ""

      beforeEach(async () => {
        // テスト用の資格を作成
        const createResult = await TestUtility.runApi(
          POST,
          "POST",
          "/api/manage/v1/certifications",
          { Authorization: `Bearer ${adminToken}` },
          {
            name: "削除テスト資格" + Date.now(),
            description: "削除テスト用の資格",
          },
        )
        const createJson = await createResult.json()
        certificationId = createJson.data.id
      })

      test("ADMINユーザ 資格を削除できる", async () => {
        const result = await TestUtility.runApi(
          DELETE,
          "DELETE",
          `/api/manage/v1/certifications?id=${certificationId}`,
          { Authorization: `Bearer ${adminToken}` },
        )
        expect(result.ok).toBe(true)
        expect(result.status).toBe(200)
        const json = await result.json()
        expect(json.success).toBe(true)
        expect(json.data.success).toBe(true)
      })

      test("USERユーザ 資格を削除できない", async () => {
        const result = await TestUtility.runApi(
          DELETE,
          "DELETE",
          `/api/manage/v1/certifications?id=${certificationId}`,
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

      test("ADMINユーザ 存在しない資格IDで削除しようとするとエラー", async () => {
        const result = await TestUtility.runApi(
          DELETE,
          "DELETE",
          "/api/manage/v1/certifications?id=invalid-id",
          { Authorization: `Bearer ${adminToken}` },
        )
        expect(result.ok).toBe(false)
        expect(result.status).toBe(404)
        const json = await result.json()
        expect(json.success).toBe(false)
        expect(json.errors).toBeDefined()
      })
    })
  })
})
