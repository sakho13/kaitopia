import { NextRequest } from "next/server"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { UserService } from "@/lib/classes/services/UserService"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("ユーザ設定の取得")

  return await api.execute("GetUserConfig", async () => {
    const { user } = await api.authorize(request)
    const userService = UserService.createByPrisma()

    if (!user)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])

    const schools = await userService.getAccessibleSchools(user.userId)

    return {
      userInfo: {
        name: user.username,
        birthDayDate: user.birthDayString,
        role: user.userRole,
      },
      canAccessManagePage: user.canAccessManagePage,
      isGuest: user.isGuestByAuthProvider,
      schools: schools.map((s) => ({
        id: s.schoolId,
        name: s.schoolName,
        description: s.schoolDescription,
        isGlobal: s.value.isGlobal,
        isPublic: s.value.isPublic,
        isSelfSchool: s.isSelfSchool,
        createdAt: s.createdAtString,
        updatedAt: s.updatedAtString,
      })),
    }
  })
}
