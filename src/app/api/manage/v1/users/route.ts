import { NextRequest } from "next/server"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { ManageUserService } from "@/lib/classes/services/ManageUserService"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用ユーザ取得API")

  return await api.execute("GetManageUsers", async () => {
    const { userService } = await api.checkAccessManagePage(request)

    const page = parseInt(request.nextUrl.searchParams.get("page") || "1") ?? 1

    const count = parseInt(
      request.nextUrl.searchParams.get("count") ?? "10",
      10,
    )

    const manageUserService = new ManageUserService(
      userService.userController,
      prisma,
    )

    const { users, totalCount, nextPage } =
      await manageUserService.getUsersForManageAdmin(count, page)

    return {
      users: users.map((u) => ({
        id: u.id,
        firebaseUid: u.firebaseUid,
        name: u.name,
        email: u.email,
        phoneNumber: u.phoneNumber,
        role: u.role,
        birthDayDate: u.birthDayDate?.toISOString() ?? null,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
        deletedAt: u.deletedAt?.toISOString() ?? null,
      })),
      totalCount,
      nextPage,
    }
  })
}
