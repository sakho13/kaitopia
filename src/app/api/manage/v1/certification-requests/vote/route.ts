import { NextRequest } from "next/server"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { ManageCertificationService } from "@/lib/classes/services/ManageCertificationService"
import { prisma } from "@/lib/prisma"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"

/**
 * 資格リクエストに賛成投票API
 */
export async function POST(request: NextRequest) {
  const api = new ApiV1Wrapper("管理用資格リクエスト投票API")

  return await api.execute("PostManageCertificationRequestsVote", async () => {
    const { userService } = await api.checkAccessManagePage(request)

    const body = await request.json()

    // バリデーション
    if (
      !body.requestId ||
      typeof body.requestId !== "string" ||
      body.requestId.length < 1
    ) {
      throw new ApiV1Error([
        { key: "RequiredValueError", params: { key: "リクエストID" } },
      ])
    }

    const manageCertificationService = new ManageCertificationService(
      userService.userController,
      prisma,
    )

    // userControllerからuserIdを取得
    if (!userService.userController.userId) {
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])
    }

    const vote = await manageCertificationService.voteForCertificationRequest(
      body.requestId,
      userService.userController.userId,
    )

    return {
      id: vote.id,
      requestId: vote.requestId,
      userId: vote.userId,
      createdAt: vote.createdAt.toISOString(),
    }
  })
}
