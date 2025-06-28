import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { FirebaseAuthUserRepository } from "@/lib/classes/repositories/FirebaseAuthUserRepository"
import { PrismaManageUserRepository } from "@/lib/classes/repositories/PrismaManageUserRepository"
import { PrismaSchoolRepository } from "@/lib/classes/repositories/PrismaSchoolRepository"
import { PrismaUserRepository } from "@/lib/classes/repositories/PrismaUserRepository"
import { ManageUserService2 } from "@/lib/classes/services/ManageUserService2"
import { UserService2 } from "@/lib/classes/services/UserService2"

export async function DELETE(req: NextRequest) {
  const api = new ApiV1Wrapper("ゲストユーザの削除")

  return await api.execute("DeleteManageUserGuest", async () => {
    await api.checkAccessManagePage(req)

    const userService = new UserService2(
      prisma,
      new PrismaUserRepository(prisma),
      new PrismaSchoolRepository(prisma),
    )

    const user = await userService.getUserInfo(api.getFirebaseUid())
    if (!user) {
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])
    }

    const manageUserService = new ManageUserService2(
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
