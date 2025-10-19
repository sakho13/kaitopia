import { NextRequest } from "next/server"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { ManagePropertyService } from "@/lib/classes/services/ManagePropertyService"
import { prisma } from "@/lib/prisma"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { PrismaSchoolRepository } from "@/lib/classes/repositories/PrismaSchoolRepository"
import { PrismaManageDashboardRepository } from "@/lib/classes/repositories/PrismaManageDashboardRepository"
import { UserService2 } from "@/lib/classes/services/UserService2"
import { PrismaUserRepository } from "@/lib/classes/repositories/PrismaUserRepository"

export async function GET(req: NextRequest) {
  const api = new ApiV1Wrapper("管理用ダッシュボード情報取得")

  return await api.execute("GetManageDashboard", async () => {
    await api.checkAccessManagePage(req)

    const schoolId = req.nextUrl.searchParams.get("schoolId") ?? null

    const userService = new UserService2(
      prisma,
      new PrismaUserRepository(prisma),
      new PrismaSchoolRepository(prisma),
    )
    const user = await userService.getUserInfo(api.getFirebaseUid())
    if (!user) {
      throw new ApiV1Error([
        {
          key: "AuthenticationError",
          params: null,
        },
      ])
    }

    const managePropertyService = new ManagePropertyService(
      prisma,
      new PrismaSchoolRepository(prisma),
      new PrismaManageDashboardRepository(prisma),
    )

    const dashboardInfo = await managePropertyService.getDashboardInfo(
      user,
      schoolId,
    )

    return {
      totalActiveGuestUserCount: dashboardInfo.totalGuestUserCount,
      totalActiveUserCount: dashboardInfo.totalActiveUserCount,
      totalUserCount: dashboardInfo.totalUserCount,

      totalQuestionCount: dashboardInfo.totalQuestionCount,
      totalExerciseCount: dashboardInfo.totalExerciseCount,
    }
  })
}
