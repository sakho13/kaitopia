import { NextRequest } from "next/server"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { prisma } from "@/lib/prisma"
import { ManageQuestionGroupService } from "@/lib/classes/services/ManageQuestionGroupService"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { UserService2 } from "@/lib/classes/services/UserService2"
import { PrismaUserRepository } from "@/lib/classes/repositories/PrismaUserRepository"
import { PrismaSchoolRepository } from "@/lib/classes/repositories/PrismaSchoolRepository"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用問題グループ一覧取得")

  return await api.execute("GetManageQuestionGroups", async () => {
    await api.checkAccessManagePage(request)

    const schoolId = request.nextUrl.searchParams.get("schoolId")
    if (!schoolId || schoolId.length < 2)
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "学校ID" } },
      ])

    const userService = new UserService2(
      prisma,
      new PrismaUserRepository(prisma),
      new PrismaSchoolRepository(prisma),
    )
    const user = await userService.getUserInfo(api.getFirebaseUid())
    if (!user)
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])

    const service = new ManageQuestionGroupService(prisma)
    const groups = await service.getQuestionGroups(user, schoolId)

    return {
      questionGroups: groups.map((g) => ({
        questionGroupId: g.value.questionGroupId,
        schoolId: g.value.schoolId,
        name: g.value.name,
        createdAt: g.value.createdAt.toISOString(),
        updatedAt: g.value.updatedAt.toISOString(),
      })),
    }
  })
}
