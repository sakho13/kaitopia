import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { ManageUserService } from "@/lib/classes/services/ManageUserService"
import { PrismaManageUserRepository } from "@/lib/classes/repositories/PrismaManageUserRepository"
import { FirebaseAuthUserRepository } from "@/lib/classes/repositories/FirebaseAuthUserRepository"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用ユーザ取得API")

  // TYPE=ADMIN はすべてのユーザを取得できる
  // その他のユーザは今後実装する

  return await api.execute("GetManageUsers", async () => {
    const { user } = await api.checkAccessManagePage(request)

    const page = parseInt(request.nextUrl.searchParams.get("page") || "1") ?? 1

    const count = parseInt(
      request.nextUrl.searchParams.get("count") ?? "10",
      10,
    )

    const manageUserService = new ManageUserService(
      prisma,
      new PrismaManageUserRepository(prisma),
      new FirebaseAuthUserRepository(),
    )

    const { users, totalCount, nextPage } =
      await manageUserService.getUsersForManageAdmin(user, count, page)

    return {
      users: users.map((u) => ({
        id: u.userId,
        name: u.value.name,
        email: u.value.email,
        phoneNumber: u.value.phoneNumber,
        role: u.value.role,
        isGuest: u.isGuestByAuthProvider,
        birthDayDate: u.birthDayString,
        createdAt: u.value.createdAt.toISOString(),
        updatedAt: u.value.updatedAt.toISOString(),
        deletedAt: u.value.deletedAt?.toISOString() ?? null,
      })),
      totalCount,
      nextPage,
    }
  })
}
