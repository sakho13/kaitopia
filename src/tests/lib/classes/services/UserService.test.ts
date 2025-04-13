import { UserService } from "@/lib/classes/services/UserService"
import { PrismaClient } from "@prisma/client"

describe("lib/classes/services/UserService", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test("インスタンス化できること", () => {
    const userService = UserService.getInstance({} as PrismaClient)
    expect(userService).toBeInstanceOf(UserService)
  })

  describe("getUserInfo", () => {
    test("通常のユーザ情報が取得できる", async () => {
      const connection = {
        user: {
          findFirst: jest.fn().mockResolvedValueOnce({
            id: "testId",
            name: "testName",
            birthDayDate: new Date(),
            role: "USER",
            ownerSchools: [],
          }),
        },
      }
      const userService = UserService.getInstance(
        connection as unknown as PrismaClient,
      )
      const userInfo = await userService.getUserInfo("testId")
      expect(userInfo).toEqual({
        id: "testId",
        name: "testName",
        birthDayDate: expect.any(Date),
        role: "USER",
        ownerSchools: [],
      })
      expect(userService.userId).toBe("testId")
      expect(userService.canAccessManagePage).toBe(false)
    })
  })
})
