/**
 * @jest-environment node
 */

import { DELETE, GET, PATCH, POST } from "@/app/api/manage/v1/exercise/route"
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

    describe("PATCH", () => {
      test("USERユーザがグローバルスクールの問題集を更新できない", async () => {
        const token = await TestUtility.getTokenByEmailAndLogin(
          UserUserEmail,
          UserUserPassword,
        )
        const result = await TestUtility.runApi(
          PATCH,
          "PATCH",
          "/api/manage/v1/exercise?exerciseId=intro_programming_1",
          {
            Authorization: `Bearer ${token}`,
          },
          {
            title: "更新されたタイトル",
            description: "更新された説明",
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

  describe("バリデーション", () => {
    describe("POST", () => {
      test("必須項目が不足している キーが存在しない", async () => {
        const token = await TestUtility.getTokenByEmailAndLogin(
          AdminUserEmail,
          AdminUserPassword,
        )
        const result = await TestUtility.runApi(
          POST,
          "POST",
          "/api/manage/v1/exercise",
          {
            Authorization: `Bearer ${token}`,
          },
          {
            schoolId: "kaitopia_1",
            property: {},
          },
        )

        expect(result.ok).toBe(false)
        expect(result.status).toBe(400)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: expect.arrayContaining([
            {
              message: "問題集のプロパティは必須です",
            },
          ]),
        })
      })

      test("必須項目が不足している 空文字", async () => {
        const token = await TestUtility.getTokenByEmailAndLogin(
          AdminUserEmail,
          AdminUserPassword,
        )
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
              title: "",
              description: "",
            },
          },
        )

        expect(result.ok).toBe(false)
        expect(result.status).toBe(400)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: expect.arrayContaining([
            {
              message: "問題集タイトルの形式が不正です",
            },
          ]),
        })
      })

      test("タイトルが200文字以上", async () => {
        const token = await TestUtility.getTokenByEmailAndLogin(
          AdminUserEmail,
          AdminUserPassword,
        )
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
              title: "a".repeat(201),
              description: "",
            },
          },
        )

        expect(result.ok).toBe(false)
        expect(result.status).toBe(400)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: expect.arrayContaining([
            {
              message: "問題集タイトルの形式が不正です",
            },
          ]),
        })
      })

      test("説明が2000文字以上", async () => {
        const token = await TestUtility.getTokenByEmailAndLogin(
          AdminUserEmail,
          AdminUserPassword,
        )
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
              title: "テスト問題集",
              description: "a".repeat(2001),
            },
          },
        )

        expect(result.ok).toBe(false)
        expect(result.status).toBe(400)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: expect.arrayContaining([
            {
              message: "問題集説明の形式が不正です",
            },
          ]),
        })
      })
    })

    describe("PATCH", () => {
      test("exerciseIdが指定されていない", async () => {
        const token = await TestUtility.getTokenByEmailAndLogin(
          AdminUserEmail,
          AdminUserPassword,
        )
        const result = await TestUtility.runApi(
          PATCH,
          "PATCH",
          "/api/manage/v1/exercise",
          {
            Authorization: `Bearer ${token}`,
          },
          {
            title: "テスト問題集",
            description: "テスト問題集の説明",
          },
        )

        expect(result.ok).toBe(false)
        expect(result.status).toBe(400)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: expect.arrayContaining([
            {
              message: "問題集IDは必須です",
            },
          ]),
        })
      })

      test("存在しないexerciseId", async () => {
        const token = await TestUtility.getTokenByEmailAndLogin(
          AdminUserEmail,
          AdminUserPassword,
        )
        const exerciseId = `not_found_exercise_id-${DateUtility.generateDateStringNow()}`
        const result = await TestUtility.runApi(
          PATCH,
          "PATCH",
          `/api/manage/v1/exercise?exerciseId=${exerciseId}`,
          {
            Authorization: `Bearer ${token}`,
          },
          {
            title: "テスト問題集",
            description: "テスト問題集の説明",
          },
        )

        expect(result.ok).toBe(false)
        expect(result.status).toBe(404)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: expect.arrayContaining([
            {
              message:
                "リソースが見つかりません。再読み込みしても解決しない場合は、お問い合わせください。",
            },
          ]),
        })
      })

      test("公開設定の使用がBooleanでない(新規で問題集を作成しテストする)", async () => {
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
        const postResultJson = await postResult.json()
        expect(postResultJson.success).toBe(true)

        const exerciseId = postResultJson.data.exercise.exerciseId
        const result = await TestUtility.runApi(
          PATCH,
          "PATCH",
          `/api/manage/v1/exercise?exerciseId=${exerciseId}`,
          {
            Authorization: `Bearer ${token}`,
          },
          {
            title: "テスト問題集",
            description: "テスト問題集の説明",
            isPublished: "true",
          },
        )

        expect(result.ok).toBe(false)
        expect(result.status).toBe(400)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: expect.arrayContaining([
            {
              message: "公開状態の形式が不正です",
            },
          ]),
        })

        const userToken = await TestUtility.getTokenByEmailAndLogin(
          UserUserEmail,
          UserUserPassword,
        )

        const checkResult = await TestUtility.runApi(
          GET,
          "GET",
          `/api/manage/v1/exercise?exerciseId=${exerciseId}`,
          {
            Authorization: `Bearer ${userToken}`,
          },
        )
        expect(checkResult.ok).toBe(false)
        expect(checkResult.status).toBe(403)
        const checkJson = await checkResult.json()
        expect(checkJson).toEqual({
          success: false,
          errors: expect.arrayContaining([
            {
              message: "アクセス権限がありません",
            },
          ]),
        })
      })
    })

    describe("DELETE", () => {
      test("exerciseIdが指定されていない", async () => {
        const token = await TestUtility.getTokenByEmailAndLogin(
          AdminUserEmail,
          AdminUserPassword,
        )
        const result = await TestUtility.runApi(
          DELETE,
          "DELETE",
          "/api/manage/v1/exercise",
          {
            Authorization: `Bearer ${token}`,
          },
        )

        expect(result.ok).toBe(false)
        expect(result.status).toBe(400)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: expect.arrayContaining([
            {
              message: "問題集IDは必須です",
            },
          ]),
        })
      })
    })
  })

  describe("CRUD", () => {
    test("問題集を作成しタイトルを更新する", async () => {
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

      const patchResult = await TestUtility.runApi(
        PATCH,
        "PATCH",
        `/api/manage/v1/exercise?exerciseId=${data.data.exercise.exerciseId}`,
        {
          Authorization: `Bearer ${token}`,
        },
        {
          title: "更新されたタイトル",
        },
      )

      expect(patchResult.ok).toBe(true)
      expect(patchResult.status).toBe(200)
      const patchData = await patchResult.json()
      expect(patchData.success).toBe(true)

      expect(patchData.data.exercise.title).toBe("更新されたタイトル")
    })

    test("問題集を作成し説明を更新する", async () => {
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

      const patchResult = await TestUtility.runApi(
        PATCH,
        "PATCH",
        `/api/manage/v1/exercise?exerciseId=${data.data.exercise.exerciseId}`,
        {
          Authorization: `Bearer ${token}`,
        },
        {
          description: "更新された説明",
        },
      )

      expect(patchResult.ok).toBe(true)
      expect(patchResult.status).toBe(200)
      const patchData = await patchResult.json()
      expect(patchData.success).toBe(true)

      expect(patchData.data.exercise.description).toBe("更新された説明")
    })

    test("問題集を作成しタイトルと説明を更新する", async () => {
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

      const patchResult = await TestUtility.runApi(
        PATCH,
        "PATCH",
        `/api/manage/v1/exercise?exerciseId=${data.data.exercise.exerciseId}`,
        {
          Authorization: `Bearer ${token}`,
        },
        {
          title: "更新されたタイトル",
          description: "更新された説明",
        },
      )

      expect(patchResult.ok).toBe(true)
      expect(patchResult.status).toBe(200)
      const patchData = await patchResult.json()
      expect(patchData.success).toBe(true)

      expect(patchData.data.exercise.title).toBe("更新されたタイトル")
      expect(patchData.data.exercise.description).toBe("更新された説明")
    })

    test("問題集を作成し削除する", async () => {
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
      const deleteData = await deleteResult.json()
      expect(deleteData.success).toBe(true)

      expect(deleteData.data.exerciseId).toBe(data.data.exercise.exerciseId)

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
  })
})
