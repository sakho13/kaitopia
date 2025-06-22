import { NextRequest } from "next/server"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { prisma } from "@/lib/prisma"
import { ManageQuestionGroupService } from "@/lib/classes/services/ManageQuestionGroupService"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"

export async function GET(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用問題グループ一覧取得")

  return await api.execute("GetManageQuestionGroups", async () => {
    const { userService } = await api.checkAccessManagePage(request)

    const schoolId = request.nextUrl.searchParams.get("schoolId")
    if (!schoolId || schoolId.length < 2)
      throw new ApiV1Error([{ key: "RequiredValueError", params: { key: "学校ID" } }])

    const service = new ManageQuestionGroupService(userService.userController, prisma)
    const groups = await service.getQuestionGroups(schoolId)

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
