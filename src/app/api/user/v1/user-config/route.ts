import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { UserService } from "@/lib/classes/services/UserService"
import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"

export function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("ユーザ設定の取得")

  return api.execute("GetUserConfig", async () => {
    await api.authorize(request)
    const userService = new UserService(prisma)

    const userInfo = await userService.getUserInfo(api.getFirebaseUid())

    return {
      baseInfo: {
        name: userInfo.name,
        birthDayDate: userInfo.birthDayDate.toISOString(),
        role: userInfo.role,
      },
      canAccessManagePage: userService.canAccessManagePage,
      isGuest: api.isGuest(),
    }
  })
}
