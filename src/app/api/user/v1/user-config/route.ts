import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { UserService } from "@/lib/classes/services/UserService"
import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("ユーザ設定の取得")

  return await api.execute("GetUserConfig", async () => {
    await api.authorize(request)
    const userService = new UserService(prisma)

    const userInfo = await userService.getUserInfo(api.getFirebaseUid())
    if (!userInfo)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])

    return {
      userInfo: {
        name: userInfo.name,
        birthDayDate: userInfo.birthDayDate
          ? userInfo.birthDayDate.toISOString()
          : null,
        role: userInfo.role,
      },
      canAccessManagePage: userService.canAccessManagePage,
      isGuest: await api.isGuest(),
    }
  })
}
