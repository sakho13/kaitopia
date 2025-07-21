import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { PrismaSchoolRepository } from "@/lib/classes/repositories/PrismaSchoolRepository"
import { PrismaUserRepository } from "@/lib/classes/repositories/PrismaUserRepository"
import { UserService2 } from "@/lib/classes/services/UserService2"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { validateBodyWrapper } from "@/lib/functions/validateBodyWrapper"

export async function POST(request: NextRequest) {
  const api = new ApiV1Wrapper("ユーザ退会")

  return await api.execute("PostUserQuit", async () => {
    await api.authorize(request)

    const body = await request.json()
    const validationResult = validatePost(body)
    if (validationResult.error) {
      throw validationResult.error
    }

    const userService = new UserService2(
      prisma,
      new PrismaUserRepository(prisma),
      new PrismaSchoolRepository(prisma),
    )

    const userInfo = await userService.getUserInfo(api.getFirebaseUid())
    if (!userInfo) {
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])
    }

    const { deletedAt, quitCode } = await userService.quitUser(userInfo, {
      reason: validationResult.result.reason,
    })

    return {
      deletedAt: deletedAt.toISOString(),
      quitCode,
    }
  })
}

function validatePost(data: unknown) {
  return validateBodyWrapper("PostUserQuit", data, (rawBody) => {
    if (typeof rawBody !== "object" || rawBody === null) {
      throw new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "退会理由" } },
      ])
    }

    if (!("reason" in rawBody)) {
      throw new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "退会理由" } },
      ])
    }

    if (
      typeof rawBody.reason !== "string" ||
      rawBody.reason.trim().length === 0
    ) {
      throw new ApiV1Error([
        { key: "InvalidFormatError", params: { key: "退会理由" } },
      ])
    }
  })
}
