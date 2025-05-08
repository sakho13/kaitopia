import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { UserService } from "@/lib/classes/services/UserService"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("ユーザ取得")

  return await api.execute("GetUserInfo", async () => {
    await api.authorize(request)

    const userService = new UserService(prisma)
    const user = await userService.getUserInfo(api.getFirebaseUid())
    if (!user)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        birthDayDate: user.birthDayDate
          ? user.birthDayDate.toISOString()
          : null,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    }
  })
}
