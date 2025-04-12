import { UserService } from "@/lib/classes/services/UserService"
import { PrismaClient } from "@prisma/client"

describe("lib/classes/services/UserService", () => {
  test("インスタンス化できること", () => {
    const userService = UserService.getInstance({} as PrismaClient)
    expect(userService).toBeInstanceOf(UserService)
  })
})
