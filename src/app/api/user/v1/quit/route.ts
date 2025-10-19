import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ApiV1Wrapper } from "@/lib/classes/common/ApiV1Wrapper"
import { PrismaSchoolRepository } from "@/lib/classes/repositories/PrismaSchoolRepository"
import { PrismaUserRepository } from "@/lib/classes/repositories/PrismaUserRepository"
import { UserService } from "@/lib/classes/services/UserService"
import { ApiV1Error } from "@/lib/classes/common/ApiV1Error"
import { validateBodyWrapper } from "@/lib/functions/validateBodyWrapper"

export async function POST(request: NextRequest) {
  const api = new ApiV1Wrapper("ユーザ退会")

  return await api.execute("PostUserQuit", async () => {
    const { user } = await api.authorize(request)

    const body = await request.json()
    const validationResult = validatePost(body)
    if (validationResult.error) {
      throw validationResult.error
    }

    const userService = new UserService(
      prisma,
      new PrismaUserRepository(prisma),
      new PrismaSchoolRepository(prisma),
    )

    if (!user) {
      throw new ApiV1Error([{ key: "AuthenticationError", params: null }])
    }

    const { deletedAt, quitCode } = await userService.quitUser(user, {
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
