import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { FirebaseAuthUserRepository } from "@/lib/classes/repositories/FirebaseAuthUserRepository"
import { PrismaManageUserRepository } from "@/lib/classes/repositories/PrismaManageUserRepository"
import { ManageUserService } from "@/lib/classes/services/ManageUserService"

export async function DELETE(req: NextRequest) {
  const api = new ApiV1Wrapper("ゲストユーザの削除")

  return await api.execute("DeleteManageUserGuest", async () => {
    const { user } = await api.checkAccessManagePage(req)

    const manageUserService = new ManageUserService(
      prisma,
      new PrismaManageUserRepository(prisma),
      new FirebaseAuthUserRepository(),
    )

    const { deletedUserCount, deletedUserIds } =
      await manageUserService.deleteGuestUsers(user)

    return {
      deletedUserCount,
      deletedUserIds,
    }
  })
}
