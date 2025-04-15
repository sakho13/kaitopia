import { UserService } from "@/lib/classes/services/UserService"
import { PrismaClient } from "@prisma/client"

describe("lib/classes/services/UserService", () => {
  afterEach(() => {
    jest.clearAllMocks()
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
      const userService = new UserService()
      userService.resetUserRepository(connection as unknown as PrismaClient)
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
