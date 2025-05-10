/**
 * @jest-environment node
 */

import { GET } from "@/app/api/user/v1/exercise/route"
import { TestUtility } from "../TestUtility"
import { DateUtility } from "@/lib/classes/common/DateUtility"
import { generateRandomLenNumber } from "@/lib/functions/generateRandomLenNumber"

describe("API /api/user/v1/exercise", () => {
  let newUserToken = ""

  beforeAll(async () => {
    const token = await TestUtility.getTokenByEmailAndSignUp(
      `test-user-${DateUtility.generateDateStringNow()}+${generateRandomLenNumber(
        3,
      )}@kaitopia.com`,
      "password",
    )
    newUserToken = token
  })

  beforeEach(() => {
    jest.clearAllMocks()

    expect(newUserToken).toBeDefined()
    expect(newUserToken.length).toBeGreaterThan(0)
  })

  describe("バリデーション", () => {
    describe("GET", () => {
      test("exerciseIdが指定されていない", async () => {
        const result = await TestUtility.runApi(
          GET,
          "GET",
          "/api/user/v1/exercise",
          {
            Authorization: `Bearer ${newUserToken}`,
          },
        )
        expect(result.ok).toBe(false)
        expect(result.status).toBe(404)
        const json = await result.json()
        expect(json).toEqual({
          success: false,
          errors: [
            {
              code: "NotFoundError",
              message:
                "リソースが見つかりません。再読み込みしても解決しない場合は、お問い合わせください。",
            },
          ],
        })
      })
    })
  })
})
